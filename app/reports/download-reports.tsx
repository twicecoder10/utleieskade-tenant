import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAppSelector } from "@/store/store";
import { useGetTenantCasesQuery } from "@/slice/tenants/index.service";

const DownloadReportsScreen = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { data: casesData, isLoading, error } = useGetTenantCasesQuery({}, {
    skip: !isLoggedIn,
  });
  const [downloadingCaseId, setDownloadingCaseId] = useState<string | null>(null);

  // Filter cases that have reports (reportPdfUrl exists or reports array has pdfUrl or reportId)
  // Only show completed cases with reports
  const allCases = casesData?.data?.cases || casesData?.cases || casesData?.data || [];
  const casesWithReports = allCases.filter(
    (caseItem: any) => {
      // Only show completed cases (check both status field names)
      const caseStatus = (caseItem.caseStatus || caseItem.status || "").toLowerCase();
      if (caseStatus !== "completed") return false;
      
      // Check if reportPdfUrl exists directly (from getTenantCases query)
      if (caseItem.reportPdfUrl) return true;
      // Check if reports array exists and has any report with pdfUrl or reportId
      if (caseItem.reports && Array.isArray(caseItem.reports) && caseItem.reports.length > 0) {
        return caseItem.reports.some((report: any) => report.pdfUrl || report.reportId);
      }
      return false;
    }
  );

  const handleDownloadReport = async (caseId: string, reportUrl: string) => {
    try {
      setDownloadingCaseId(caseId);
      
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
      
      // If reportUrl is a full URL, use it directly; otherwise construct it
      const downloadUrl = reportUrl.startsWith('http') 
        ? reportUrl 
        : `${apiUrl}${reportUrl.startsWith('/') ? '' : '/'}${reportUrl}`;
      
      const documentDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
      const fileUri = `${documentDir}report-${caseId}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (downloadResult.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("Success", "Report downloaded successfully");
        }
      } else {
        throw new Error(`Failed to download report: ${downloadResult.status}`);
      }
    } catch (error: any) {
      console.error("Download error:", error);
      Alert.alert("Error", error?.message || "Failed to download report");
    } finally {
      setDownloadingCaseId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Download Reports" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2387D4" />
          <Text className="text-neutral-500 mt-4">Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Download Reports" showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Error loading reports</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (casesWithReports.length === 0) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Download Reports" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="file-text" size={64} color="#D1D5DB" />
          <Text className="text-lg text-neutral-500 mt-4">No reports available</Text>
          <Text className="text-sm text-neutral-400 mt-2 text-center">
            Reports will appear here once inspectors complete their assessments
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Download Reports" showBack />

        <View className="mt-6 gap-4">
          {casesWithReports.map((caseItem: any) => {
            const caseId = caseItem.caseId || caseItem.caseID;
            // Get report URL from reportPdfUrl or from reports array
            // If we have reportPdfUrl, use it directly
            let reportUrl = caseItem.reportPdfUrl;
            let reportId: string | null = null;
            
            // If no reportPdfUrl, check reports array for pdfUrl or reportId
            if (!reportUrl && caseItem.reports && Array.isArray(caseItem.reports)) {
              const reportWithPdf = caseItem.reports.find((r: any) => r.pdfUrl || r.reportId);
              if (reportWithPdf) {
                reportUrl = reportWithPdf.pdfUrl;
                reportId = reportWithPdf.reportId;
              }
            }
            
            return (
              <View
                key={caseId}
                className="p-4 bg-white rounded-2xl border border-[#E2E2E2]"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-neutral-900">
                      Case: {caseId}
                    </Text>
                    <Text className="text-sm text-neutral-500 mt-1">
                      {caseItem.caseDescription || caseItem.caseTitle || "No description"}
                    </Text>
                    <Text className="text-xs text-neutral-400 mt-1">
                      {caseItem.caseCompletedDate 
                        ? `Completed: ${new Date(caseItem.caseCompletedDate).toLocaleDateString()}`
                        : caseItem.createdAt 
                        ? `Reported: ${new Date(caseItem.createdAt).toLocaleDateString()}`
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      // If we have a reportId but no direct URL, use the tenant report endpoint
                      if (reportId && !reportUrl) {
                        const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
                        await handleDownloadReport(caseId, `${apiUrl}/tenants/reports/${reportId}/pdf`);
                      } else if (reportUrl) {
                        await handleDownloadReport(caseId, reportUrl);
                      } else {
                        Alert.alert("Error", "Report URL not available");
                      }
                    }}
                    disabled={downloadingCaseId === caseId || (!reportUrl && !reportId)}
                    className="p-2"
                  >
                    {downloadingCaseId === caseId ? (
                      <ActivityIndicator size="small" color="#2387D4" />
                    ) : (
                      <AntDesign name="download" size={20} color="#2387D4" />
                    )}
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center gap-2 mt-2">
                  <View
                    className={`px-2 py-1 rounded ${
                      caseItem.caseStatus === "completed"
                        ? "bg-green-100"
                        : caseItem.caseStatus === "in-progress"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <Text
                      className={`text-xs capitalize ${
                        caseItem.caseStatus === "completed"
                          ? "text-green-700"
                          : caseItem.caseStatus === "in-progress"
                          ? "text-blue-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {caseItem.caseStatus || "open"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DownloadReportsScreen;


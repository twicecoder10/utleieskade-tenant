import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import { useGetCaseDetailsQuery } from "@/slice/cases/index.service";
import { getApiUrl } from "@/utils/apiUrl";
import { useAppSelector } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";

const ReportDetails = () => {
  const params = useLocalSearchParams();
  const caseId = params.caseId as string;
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const [imageViewer, setImageViewer] = useState<{
    open: boolean;
    imageUrl: string;
  }>({ open: false, imageUrl: "" });

  const { data, isLoading, error } = useGetCaseDetailsQuery(caseId, {
    skip: !isLoggedIn || !caseId, // Skip query if not logged in or no caseId
  });

  const caseData = data?.data;

  const openImageViewer = (imageUrl: string) => {
    setImageViewer({ open: true, imageUrl });
  };

  const closeImageViewer = () => {
    setImageViewer({ open: false, imageUrl: "" });
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      open: "#10B981",
      "in-progress": "#3B82F6",
      "on-hold": "#F59E0B",
      completed: "#8B5CF6",
      cancelled: "#EF4444",
    };
    return colorMap[status] || "#6B7280";
  };

  const getUrgencyColor = (urgency: string) => {
    const colorMap: Record<string, string> = {
      high: "#EF4444",
      moderate: "#F59E0B",
      low: "#10B981",
    };
    return colorMap[urgency] || "#6B7280";
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Case Details" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2387D4" />
          <Text className="text-neutral-500 mt-4">Loading case details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !caseData) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Case Details" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="exclamation-circle" size={64} color="#EF4444" />
          <Text className="text-lg text-red-600 mt-4">Error loading case</Text>
          <Text className="text-sm text-neutral-500 mt-2">
            {error ? "Failed to load case details" : "Case not found"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const apiUrl = getApiUrl();

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Case Details" showBack />

        {/* Case Status and Urgency */}
        <View className="flex-row gap-3 mt-6">
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${getStatusColor(caseData.caseStatus)}20` }}
          >
            <Text
              className="text-xs font-semibold capitalize"
              style={{ color: getStatusColor(caseData.caseStatus || caseData.status) }}
            >
              {(caseData.caseStatus || caseData.status || "open").toLowerCase().replace(/\s+/g, '-')}
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${getUrgencyColor(caseData.caseUrgencyLevel)}20` }}
          >
            <Text
              className="text-xs font-semibold capitalize"
              style={{ color: getUrgencyColor(caseData.caseUrgencyLevel) }}
            >
              {caseData.caseUrgencyLevel} Priority
            </Text>
          </View>
        </View>

        {/* Case Information */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-lg font-semibold text-neutral-900 mb-4">
            Case Information
          </Text>

          <View className="gap-3">
            <View>
              <Text className="text-xs text-neutral-500 mb-1">Case ID</Text>
              <Text className="text-sm text-neutral-900 font-medium">
                {caseData.caseId}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-neutral-500 mb-1">Description</Text>
              <Text className="text-sm text-neutral-900">
                {caseData.caseDescription || "No description"}
              </Text>
            </View>

            {caseData.buildingNumber && (
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Building Number</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.buildingNumber}
                </Text>
              </View>
            )}

            <View>
              <Text className="text-xs text-neutral-500 mb-1">Submitted Date</Text>
              <Text className="text-sm text-neutral-900">
                {new Date(caseData.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {caseData.caseDeadline && (
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Deadline</Text>
                <Text className="text-sm text-neutral-900">
                  {new Date(caseData.caseDeadline).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Information */}
        {caseData.property && (
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Property Information
            </Text>

            <View className="gap-3">
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Address</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyAddress}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">City</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyCity}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">Country</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyCountry}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Damages */}
        {caseData.damages && caseData.damages.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Damage Details ({caseData.damages.length})
            </Text>

            {caseData.damages.map((damage: any, index: number) => (
              <View
                key={damage.damageId || index}
                className="p-4 mb-4 bg-white rounded-2xl border border-[#E2E2E2]"
              >
                <Text className="text-base font-semibold text-neutral-900 mb-3">
                  Room {index + 1} - {damage.damageLocation}
                </Text>

                <View className="gap-3">
                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Damage Type</Text>
                    <Text className="text-sm text-neutral-900">
                      {damage.damageType}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Description</Text>
                    <Text className="text-sm text-neutral-900">
                      {damage.damageDescription || "No description"}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Date Noticed</Text>
                    <Text className="text-sm text-neutral-900">
                      {new Date(damage.damageDate).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Photos */}
                  {damage.damagePhotos && damage.damagePhotos.length > 0 && (
                    <View className="mt-3">
                      <Text className="text-xs text-neutral-500 mb-2">
                        Photos ({damage.damagePhotos.length})
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                          {damage.damagePhotos.map((photo: any, photoIndex: number) => {
                            // Handle photo URLs - could be full URL (Azure) or relative path
                            let imageUrl = photo.photoUrl;
                            if (imageUrl && typeof imageUrl === 'string') {
                              imageUrl = imageUrl.trim();
                              // Only prepend API URL if it's not already a full URL (Azure URLs should already be full URLs)
                              if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                                if (apiUrl) {
                                  imageUrl = imageUrl.startsWith('/') 
                                    ? `${apiUrl}${imageUrl}` 
                                    : `${apiUrl}/${imageUrl}`;
                                }
                              }
                            }
                            
                            if (!imageUrl) {
                              return null;
                            }
                            
                            return (
                              <TouchableOpacity
                                key={photo.photoId || photoIndex}
                                onPress={() => openImageViewer(imageUrl)}
                                className="relative"
                              >
                                <Image
                                  source={{ 
                                    uri: imageUrl,
                                    cache: 'force-cache'
                                  }}
                                  className="w-24 h-24 rounded-lg"
                                  resizeMode="cover"
                                  onError={(error) => {
                                    console.error("Failed to load image:", imageUrl, error);
                                  }}
                                />
                                {photo.description && (
                                  <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 rounded-b-lg">
                                    <Text className="text-xs text-white" numberOfLines={1}>
                                      {photo.description}
                                    </Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Inspector Information */}
        {caseData.inspector && (
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Assigned Inspector
            </Text>

            <View className="gap-2">
              <Text className="text-sm text-neutral-900">
                {caseData.inspector.userFirstName} {caseData.inspector.userLastName}
              </Text>
              {caseData.inspector.userEmail && (
                <Text className="text-xs text-neutral-500">
                  {caseData.inspector.userEmail}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Inspector Report Section */}
        {caseData.reports && caseData.reports.length > 0 && (
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Inspector Report
            </Text>
            
            {caseData.reports.map((report: any, index: number) => (
              <View key={report.reportId || index} className="gap-3 mb-4">
                {report.reportDescription && (
                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Report Description</Text>
                    <Text className="text-sm text-neutral-900">
                      {report.reportDescription}
                    </Text>
                  </View>
                )}
                
                {report.reportId && (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
                        if (!token) {
                          Alert.alert("Error", "Please login to download report");
                          return;
                        }
                        
                        const apiUrl = getApiUrl();
                        // Use the tenant report PDF endpoint
                        const reportUrl = `${apiUrl}/tenants/reports/${report.reportId}/pdf`;
                        
                        // For mobile, use FileSystem to download and share
                        try {
                          const documentDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
                          const fileUri = `${documentDir}report-${report.reportId}.pdf`;
                          
                          const downloadResult = await FileSystem.downloadAsync(reportUrl, fileUri, {
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
                        } catch (downloadError: any) {
                          // Fallback to opening URL directly in browser
                          console.log("Direct download failed, trying URL redirect:", downloadError);
                          const urlWithAuth = `${reportUrl}?token=${encodeURIComponent(token)}`;
                          await Linking.openURL(urlWithAuth);
                        }
                      } catch (error: any) {
                        console.error("Download report error:", error);
                        Alert.alert("Error", error?.message || "Failed to download report. Please try again.");
                      }
                    }}
                    className="flex-row items-center justify-center gap-2 bg-primary-500 p-3 rounded-lg mt-2"
                  >
                    <AntDesign name="download" size={20} color="white" />
                    <Text className="text-white font-semibold">Download Report (PDF)</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Image Viewer Modal */}
        {imageViewer.open && (
          <View className="absolute inset-0 bg-black/90 z-50 items-center justify-center">
            <TouchableOpacity
              onPress={closeImageViewer}
              className="absolute top-10 right-10 z-10"
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: imageViewer.imageUrl }}
              className="w-full h-3/4"
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDetails;

import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign } from "@expo/vector-icons";
import { useGetReceiptsQuery } from "@/slice/cases/index.service";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAppSelector } from "@/store/store";

const ReceiptsScreen = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { data: receiptsData, isLoading, error } = useGetReceiptsQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null);

  const receipts = receiptsData?.data || [];

  const handleDownloadReceipt = async (receiptId: string) => {
    try {
      setDownloadingReceiptId(receiptId);
      
      // Get token for authentication
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
      const downloadUrl = `${apiUrl}/tenants/receipts/${receiptId}/download`;
      
      // Use expo-file-system to download the file directly
      const fileUri = `${FileSystem.documentDirectory}receipt-${receiptId}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (downloadResult.status === 200) {
        // Share/open the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("Success", "Receipt downloaded successfully");
        }
      } else {
        throw new Error(`Failed to download receipt: ${downloadResult.status}`);
      }
    } catch (error: any) {
      console.error("Download error:", error);
      Alert.alert("Error", error?.message || "Failed to download receipt");
    } finally {
      setDownloadingReceiptId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Receipts" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2387D4" />
          <Text className="text-neutral-500 mt-4">Loading receipts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Receipts" showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Error loading receipts</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (receipts.length === 0) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Receipts" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="filetext1" size={64} color="#D1D5DB" />
          <Text className="text-lg text-neutral-500 mt-4">No receipts found</Text>
          <Text className="text-sm text-neutral-400 mt-2 text-center">
            Your purchase receipts will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Receipts" showBack />

        <View className="mt-6 gap-4">
          {receipts.map((receipt: any) => (
            <View
              key={receipt.receiptId || receipt.paymentId}
              className="p-4 bg-white rounded-2xl border border-[#E2E2E2]"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-neutral-900">
                    Receipt #{receipt.receiptId || receipt.paymentId}
                  </Text>
                  <Text className="text-sm text-neutral-500 mt-1">
                    {receipt.caseId && `Case: ${receipt.caseId}`}
                  </Text>
                  <Text className="text-xs text-neutral-400 mt-1">
                    {new Date(receipt.paymentDate || receipt.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDownloadReceipt(receipt.receiptId || receipt.paymentId)}
                  disabled={downloadingReceiptId === (receipt.receiptId || receipt.paymentId)}
                  className="p-2"
                >
                  {downloadingReceiptId === (receipt.receiptId || receipt.paymentId) ? (
                    <ActivityIndicator size="small" color="#2387D4" />
                  ) : (
                    <AntDesign name="download" size={20} color="#2387D4" />
                  )}
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">Amount:</Text>
                <Text className="text-lg font-bold text-neutral-900">
                  {receipt.paymentAmount || receipt.amount} NOK
                </Text>
              </View>

              <View className="flex-row items-center gap-2 mt-2">
                <View
                  className={`px-2 py-1 rounded ${
                    receipt.paymentStatus === "processed"
                      ? "bg-green-100"
                      : receipt.paymentStatus === "pending"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs capitalize ${
                      receipt.paymentStatus === "processed"
                        ? "text-green-700"
                        : receipt.paymentStatus === "pending"
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {receipt.paymentStatus || "pending"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptsScreen;


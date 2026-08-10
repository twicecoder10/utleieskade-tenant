import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAppSelector } from "@/store/store";
import { useGetTenantPaymentsQuery } from "@/slice/tenants/index.service";

const PaymentHistoryScreen = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { data: paymentsData, isLoading, error, refetch } = useGetTenantPaymentsQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [downloadingPaymentId, setDownloadingPaymentId] = useState<string | null>(null);

  const payments = paymentsData?.data?.payments || paymentsData?.payments || paymentsData?.data || [];

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      setDownloadingPaymentId(paymentId);
      
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
      const downloadUrl = `${apiUrl}/tenants/payments/${paymentId}/receipt`;
      
      const documentDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
      const fileUri = `${documentDir}receipt-${paymentId}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (downloadResult.status === 200) {
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
      setDownloadingPaymentId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Payment History" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2387D4" />
          <Text className="text-neutral-500 mt-4">Loading payments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    console.error("Payment history error:", error);
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Payment History" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="exclamation-circle" size={64} color="#EF4444" />
          <Text className="text-red-500 text-lg mt-4">Error loading payments</Text>
          <Text className="text-neutral-500 text-sm mt-2 text-center px-4">
            {error && 'data' in error && 'message' in error.data 
              ? error.data.message 
              : error && 'message' in error 
              ? error.message 
              : "Please try again later"}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-6 bg-primary-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (payments.length === 0) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Payment History" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="creditcard" size={64} color="#D1D5DB" />
          <Text className="text-lg text-neutral-500 mt-4">No payments found</Text>
          <Text className="text-sm text-neutral-400 mt-2 text-center">
            Your payment history will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Payment History" showBack />

        <View className="mt-6 gap-4">
          {payments.map((payment: any) => (
            <View
              key={payment.paymentId || payment.id}
              className="p-4 bg-white rounded-2xl border border-[#E2E2E2]"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-neutral-900">
                    Payment #{payment.paymentId || payment.id}
                  </Text>
                  <Text className="text-sm text-neutral-500 mt-1">
                    {payment.caseId && `Case: ${payment.caseId}`}
                  </Text>
                  <Text className="text-xs text-neutral-400 mt-1">
                    {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDownloadReceipt(payment.paymentId || payment.id)}
                  disabled={downloadingPaymentId === (payment.paymentId || payment.id)}
                  className="p-2"
                >
                  {downloadingPaymentId === (payment.paymentId || payment.id) ? (
                    <ActivityIndicator size="small" color="#2387D4" />
                  ) : (
                    <AntDesign name="download" size={20} color="#2387D4" />
                  )}
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">Amount:</Text>
                <Text className="text-lg font-bold text-neutral-900">
                  {payment.paymentAmount || payment.amount} NOK
                </Text>
              </View>

              <View className="flex-row items-center gap-2 mt-2">
                <View
                  className={`px-2 py-1 rounded ${
                    payment.paymentStatus === "processed"
                      ? "bg-green-100"
                      : payment.paymentStatus === "pending"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs capitalize ${
                      payment.paymentStatus === "processed"
                        ? "text-green-700"
                        : payment.paymentStatus === "pending"
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {payment.paymentStatus || "pending"}
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

export default PaymentHistoryScreen;


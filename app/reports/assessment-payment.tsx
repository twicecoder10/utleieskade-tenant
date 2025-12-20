import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from "@/slice/payments/index.service";
import { useStripe } from "@stripe/stripe-react-native";

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = "pk_test_51S8GeZ7JTnPFD5f8GW16A2EGd6kbnfmJpBRtH9jj0myVq3vzoK0Wp7mCgbSOETBohD6YJXjUSLwjVdmWB3OlYgPq00GSl1t760";

const AssessmentPayment = () => {
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const rooms = params.rooms ? JSON.parse(params.rooms as string) : [];
  const buildingNumber = params.buildingNumber as string;
  const propertyAddress = params.propertyAddress as string;
  const assessmentLevel = params.assessmentLevel as "standard" | "detailed";
  const isUrgent = params.isUrgent === "true";
  const optionalTenantName = params.optionalTenantName as string;
  const optionalLandlordName = params.optionalLandlordName as string;
  const totalPrice = parseFloat(params.totalPrice as string) || 0;

  // Note: Stripe should be initialized in _layout.tsx with StripeProvider

  const prepareCaseData = () => {
    return {
      propertyAddress,
      buildingNumber,
      caseDescription: rooms.map((r: any) => r.description).join("; "),
      caseUrgencyLevel: isUrgent ? "high" : "moderate",
      assessmentLevel,
      optionalTenantName: optionalTenantName || undefined,
      optionalLandlordName: optionalLandlordName || undefined,
      damages: rooms.map((room: any) => ({
        damageLocation: room.damageLocation,
        damageType: room.damageType,
        damageDescription: room.description,
        damageDate: room.date,
        photos: room.photos.map((p: any) => ({
          photoType: p.photoType,
          photoUrl: p.photoUrl,
          description: p.description || "",
        })),
      })),
    };
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Step 1: Create payment intent on backend
      const caseData = prepareCaseData();
      const paymentIntentResponse = await createPaymentIntent({
        amount: totalPrice,
        caseData,
        metadata: {
          assessmentLevel,
          isUrgent,
          roomCount: rooms.length,
        },
      }).unwrap();

      if (!paymentIntentResponse.data?.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      setPaymentIntentId(paymentIntentResponse.data.paymentIntentId);

      // Step 2: Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Utleieskade",
        paymentIntentClientSecret: paymentIntentResponse.data.clientSecret,
        defaultBillingDetails: {
          name: optionalTenantName || "Tenant",
        },
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // Step 3: Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== "Canceled") {
          throw new Error(presentError.message);
        } else {
          // User canceled
          setIsProcessing(false);
          return;
        }
      }

      // Step 4: Payment succeeded, confirm on backend and create case
      await handlePaymentSuccess(paymentIntentResponse.data.paymentIntentId, caseData);
    } catch (error: any) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        error?.message || "Payment processing failed. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string, caseData: any) => {
    try {
      const response = await confirmPayment({
        paymentIntentId,
        caseData,
      }).unwrap();

      Alert.alert(
        "Success",
        "Payment completed and case submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Failed to confirm payment:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to submit case. Please contact support."
      );
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Payment" showBack />

        {/* Case Summary */}
        <View className="p-4 mt-6 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-lg font-semibold text-neutral-900 mb-4">
            Case Summary
          </Text>

          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Property:</Text>
              <Text className="text-sm text-neutral-900">{propertyAddress}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Building:</Text>
              <Text className="text-sm text-neutral-900">{buildingNumber}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Rooms:</Text>
              <Text className="text-sm text-neutral-900">{rooms.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Assessment:</Text>
              <Text className="text-sm text-neutral-900 capitalize">
                {assessmentLevel}
              </Text>
            </View>
            {isUrgent && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-neutral-500">Urgent:</Text>
                <Text className="text-sm text-red-600">Yes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Details */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-lg font-semibold text-neutral-900 mb-4">
            Payment Details
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-[#E2E2E2]">
              <Text className="text-base text-neutral-700">Total Amount</Text>
              <Text className="text-xl font-bold text-neutral-900">
                {totalPrice.toFixed(2)} NOK
              </Text>
            </View>

            <Text className="text-xs text-neutral-500 mt-2">
              Payment will be processed securely via Stripe. Apple Pay and Google Pay
              are supported.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="mt-6">
          <Button
            label={
              isProcessing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                "Pay Now"
              )
            }
            onPress={handlePayment}
            disabled={isProcessing}
            style="bg-primary-500 p-3 rounded-full w-full"
            textStyle="font-bold text-white text-base font-medium"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssessmentPayment;

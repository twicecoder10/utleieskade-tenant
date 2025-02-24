import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/slice/auth/index.service";

const Verify = () => {
  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending, error: resendError }] =
    useResendOtpMutation();

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      return Alert.alert("Error", "Enter a valid 6-digit OTP");
    }
    try {
      await verifyOtp({ userEmail, otpCode: otp }).unwrap();
      router.push("/(tabs)");
    } catch (error: string | any) {
      Alert.alert("Verification Failed", error?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ userEmail }).unwrap();
      Alert.alert("Success", "OTP has been resent successfully!");
    } catch (error: string | any) {
      Alert.alert("Error", error?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <View className="mb-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#101828" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <View className="items-center">
          <Text className="text-3xl font-semibold">Verify your email</Text>
          <Text className="text-base text-neutral-700">
            We sent a code to <Text className="font-semibold">{userEmail}</Text>
          </Text>
        </View>

        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="items-center mt-6">
              <OtpInput
                numberOfDigits={5}
                autoFocus
                onTextChange={setOtp}
                theme={{
                  pinCodeTextStyle: { fontSize: 24, fontWeight: "bold" },
                }}
              />

              <View className="flex-row gap-1 mt-4">
                <Text className="text-base text-neutral-700">
                  Didn't get the code?
                </Text>
                <TouchableOpacity onPress={handleResend} disabled={isResending}>
                  <Text className="text-base font-semibold text-yellow-500">
                    {isResending ? "Resending..." : "Resend"}
                  </Text>
                </TouchableOpacity>
              </View>

              {verifyError && (
                <Text className="text-red-500 mt-2">
                  {"data" in verifyError && verifyError.data
                    ? (verifyError.data as { message?: string })?.message ||
                      "Verification failed"
                    : "Verification failed"}
                </Text>
              )}

              {resendError && (
                <Text className="text-red-500 mt-2">
                  {"data" in resendError && resendError.data
                    ? (resendError.data as { message?: string })?.message ||
                      "Resend failed"
                    : "Resend failed"}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <View className="mt-6">
          <Button
            label={isVerifying ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            disabled={isVerifying}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verify;

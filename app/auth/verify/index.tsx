import React, { useState, useEffect, useCallback } from "react";
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
import { useAppDispatch } from "@/store/store";
import { setLoggedIn } from "@/slice/userSlice";

const Verify = () => {
  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending, error: resendError }] =
    useResendOtpMutation();

  const handleVerify = useCallback(async () => {
    if (!otp || otp.length < 6) {
      return Alert.alert("Error", "Enter a valid 6-digit OTP");
    }
    if (!userEmail) {
      return Alert.alert("Error", "Email address is missing. Please go back and try again.");
    }
    try {
      const response = await verifyOtp({ userEmail, otpCode: otp }).unwrap();
      // The mutation's onQueryStarted should handle setting logged in state
      // But we'll also ensure it's set here as a fallback
      dispatch(setLoggedIn(true));
      Alert.alert("Success", "Email verified successfully!");
      router.replace("/(tabs)");
    } catch (error: string | any) {
      Alert.alert("Verification Failed", error?.data?.message || "Invalid OTP");
    }
  }, [otp, userEmail, verifyOtp]);

  const handleResend = async () => {
    if (!userEmail) {
      return Alert.alert("Error", "Email address is missing. Please go back and try again.");
    }
    try {
      await resendOtp({ userEmail }).unwrap();
      Alert.alert("Success", "OTP has been resent successfully!");
      setOtp(""); // Clear OTP after resend
    } catch (error: string | any) {
      Alert.alert("Error", error?.data?.message || "Failed to resend OTP");
    }
  };

  // Auto-verify when OTP is complete (6 digits)
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && userEmail) {
      handleVerify();
    }
  }, [otp, isVerifying, userEmail, handleVerify]);

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
            We sent a code to <Text className="font-semibold">{userEmail || "your email"}</Text>
          </Text>
          {!userEmail && (
            <Text className="text-red-500 text-sm mt-2">
              Email address is missing. Please go back and try again.
            </Text>
          )}
        </View>

        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="items-center mt-6">
              <OtpInput
                numberOfDigits={6}
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


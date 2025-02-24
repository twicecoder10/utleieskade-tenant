import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetPasswordMutation,
} from "@/slice/auth/index.service";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [verifyResetPassword, { isLoading: isVerifyingOTP }] =
    useVerifyResetPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      await forgotPassword({ userEmail: email }).unwrap();
      setShowOTP(true);
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to send reset email. Please try again later."
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    try {
      await verifyResetPassword({ token: otp }).unwrap();
      setShowNewPassword(true);
    } catch (error: any) {
      console.error("Failed to verify OTP:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    try {
      await resetPassword({ token: otp, userPassword: newPassword }).unwrap();
      Alert.alert("Success", "Your password has been reset successfully.");
      router.push("/auth");
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4 py-2 pb-8 bg-white">
      {/* Back Button */}
      <View className="mb-4 flex-row items-center pt-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#101828" />
        </Pressable>
        <Text className="text-2xl text-neutral-900 font-semibold flex-1 text-center">
          {showNewPassword
            ? "Reset Password"
            : showOTP
            ? "OTP Verification"
            : "Forgot Password"}
        </Text>
      </View>

      <ScrollView>
        <View>
          {/* Header Text */}
          <View className="flex-col gap-2 w-full mb-6">
            {/* Subtext */}
            {!showOTP && !showNewPassword ? (
              <View className="">
                <View className="h-[301px] flex items-center justify-center">
                  <Image
                    source={require("@/assets/images/forgot-password.png")}
                    className="size-[197px]"
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-col gap-2 w-full">
                  <Text className="text-3xl text-neutral-900 font-semibold text-center">
                    Verify Email
                  </Text>
                  <Text className="text-neutral-400 text-center text-lg">
                    A link will be sent to verify your account
                  </Text>
                </View>
              </View>
            ) : showOTP && !showNewPassword ? (
              <View className="">
                <View className="h-[301px] flex items-center justify-center">
                  <Image
                    source={require("@/assets/images/forgot-password.png")}
                    className="size-[197px]"
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-col gap-2 w-full">
                  <Text className="text-3xl text-neutral-900 font-semibold text-center">
                    Verification
                  </Text>
                  <View className="flex-row gap-x-1 gap-y-0 flex-wrap justify-center text-center">
                    <Text className="text-neutral-400 text-center text-lg">
                      Enter the 6-digit OTP sent to
                    </Text>
                    <Text className="text-neutral-400 text-center text-lg">
                      {email || "yourname@gmail.com"}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="">
                <View className="h-[301px] flex items-center justify-center">
                  <Image
                    source={require("@/assets/images/forgot-password.png")}
                    className="size-[197px]"
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-col gap-2 w-full">
                  <Text className="text-3xl text-neutral-900 font-semibold text-center">
                    Reset Password
                  </Text>
                  <Text className="text-neutral-400 text-center text-lg">
                    Enter your new password
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Email Input or OTP Input or New Password Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-col gap-4 items-center">
                {/* Show Email Input */}
                {!showOTP && !showNewPassword ? (
                  <View className="w-full gap-1">
                    <Text className="text-base">E-mail</Text>
                    <TextInput
                      placeholder="Email Address"
                      value={email}
                      onChangeText={setEmail}
                      className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                ) : showOTP && !showNewPassword ? (
                  // Show OTP Input
                  <View>
                    <Text className="text-center mb-3">Enter code</Text>

                    <OtpInput
                      numberOfDigits={6}
                      focusColor="#2387D4"
                      autoFocus={true}
                      hideStick={true}
                      placeholder="------"
                      blurOnFilled={true}
                      type="numeric"
                      secureTextEntry={false}
                      focusStickBlinkingDuration={500}
                      onTextChange={(text) => setOtp(text)}
                      onFilled={handleVerifyOTP}
                      theme={{
                        containerStyle: {
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        },
                        pinCodeContainerStyle: {
                          borderColor: "#E5E7EB",
                          borderWidth: 1,
                          borderRadius: 12,
                          width: 48,
                          height: 48,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        pinCodeTextStyle: {
                          fontSize: 24,
                          fontWeight: "semibold",
                          color: "#374151",
                        },
                        placeholderTextStyle: {
                          color: "#D0D5DD",
                        },
                        focusedPinCodeContainerStyle: {
                          borderColor: "#10B981",
                        },
                      }}
                    />

                    <View className="flex-row justify-between mt-3">
                      <View className="flex-row gap-1 items-center">
                        <Text className="text-sm">
                          Didn’t receive any code?
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={handleSendEmail}
                        >
                          <Text className="text-sm text-primary-500 font-medium underline">
                            Resend
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Text className="text-sm">00:40</Text>
                    </View>
                  </View>
                ) : (
                  // Show New Password Input
                  <View className="w-full gap-1">
                    <Text className="text-base">New Password</Text>
                    <TextInput
                      placeholder="New Password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>

        {/* Continue Button */}
        <View className="mt-10">
          <Button
            label={
              isSendingEmail || isVerifyingOTP || isResettingPassword ? (
                <ActivityIndicator color="#FFF" />
              ) : showNewPassword ? (
                "Reset Password"
              ) : showOTP ? (
                "Verify"
              ) : (
                "Send"
              )
            }
            onPress={() => {
              if (!showOTP && !showNewPassword) handleSendEmail();
              else if (showOTP && !showNewPassword) handleVerifyOTP();
              else handleResetPassword();
            }}
            style="bg-primary-500 p-3 rounded-full w-full"
            textStyle="font-bold text-white text-xl"
          />
        </View>

        <StatusBar style={Platform.OS === "ios" ? "auto" : "dark"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

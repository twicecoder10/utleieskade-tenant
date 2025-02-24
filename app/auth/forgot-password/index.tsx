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
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false); // Toggle for OTP Screen

  return (
    <SafeAreaView className="flex-1 px-4 py-2 pb-8 bg-white">
      {/* Back Button */}
      <View className="mb-4 flex-row items-center pt-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#101828" />
        </Pressable>
        <Text className="text-2xl text-neutral-900 font-semibold flex-1 text-center">
          {showOTP ? "OTP Verification" : "Forgot Password"}
        </Text>
      </View>

      <ScrollView>
        <View>
          {/* Header Text */}
          <View className="flex-col gap-2 w-full mb-6">
            {/* Subtext */}
            {!showOTP ? (
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
            )}
          </View>

          {/* Email Input or OTP Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-col gap-4 items-center">
                {/* Show Email Input */}
                {!showOTP ? (
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
                ) : (
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
                      onTextChange={(text) => console.log(text)}
                      onFilled={() => router.push("/auth")}
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
                        <TouchableOpacity activeOpacity={0.5}>
                          <Text className="text-sm text-primary-500 font-medium underline">
                            Resend
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Text className="text-sm">00:40</Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>

        {/* Continue Button */}
        <View className="mt-10">
          <Button
            label={showOTP ? "Verify" : "Send"}
            onPress={() => {
              if (!showOTP) setShowOTP(true); // Toggle to OTP screen
              else router.push("/auth"); // Navigate after OTP
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

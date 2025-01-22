import React from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import Button from "@/components/ui/Button";

const Verify = () => {
  return (
    <SafeAreaView className="flex-1 px-4 py-2 pb-8 bg-white">
      <View className="mb-4 py-2">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#101828" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexDirection: "column",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <View>
          {/* Header Text */}
          <View className="flex-col gap-2 w-full mb-6">
            <Text className="text-3xl text-neutral-900 font-semibold">
              Verify your email
            </Text>

            <View className="flex-row gap-1">
              <Text className="text-base text-neutral-700">
                We have sent a code to
              </Text>
              <Text className="text-base text-neutral-700 font-semibold">
                hello@ayodeji.com
              </Text>
            </View>
          </View>

          {/* OTP Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex-col gap-4 items-center">
                <OtpInput
                  numberOfDigits={5}
                  focusColor="#10B981"
                  autoFocus={true}
                  hideStick={true}
                  placeholder="******"
                  blurOnFilled={true}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onTextChange={(text) => console.log(text)}
                  theme={{
                    containerStyle: {
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    },
                    pinCodeContainerStyle: {
                      borderColor: "#E5E7EB",
                      borderWidth: 1,
                      borderRadius: 8,
                      width: 52,
                      height: 52,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    pinCodeTextStyle: {
                      fontSize: 36,
                      fontWeight: "bold",
                      color: "#374151",
                    },
                    placeholderTextStyle: {
                      color: "#D0D5DD",
                    },
                    focusedPinCodeContainerStyle: {
                      borderColor: "#AB9A6B", // Focus border green
                    },
                    filledPinCodeContainerStyle: {
                      borderColor: "#D1D5DB",
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                />

                {/* Resend Code */}
                <View className="flex-row gap-1 mt-2">
                  <Text className="text-base text-neutral-700">
                    Didn’t get the code?
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text className="text-base text-yellow-500 font-semibold">
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>

        {/* Continue Button */}
        <View>
          <Button
            label="Verify"
            onPress={() => router.push("/auth")}
            style="bg-primary-500 p-3 rounded-full w-full"
            textStyle="font-bold text-white text-xl"
          />
        </View>

        <StatusBar style={Platform.OS === "ios" ? "auto" : "dark"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verify;

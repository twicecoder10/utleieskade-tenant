import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
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
import Button from "@/components/ui/Button";

const SignupScreen = () => {
  const [selected, setSelected] = useState<"Tenant" | "Landlord" | null>(
    "Tenant"
  );

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-center pt-8">
          <Image
            source={require("@/assets/images/Logo2.png")}
            className="w-[84px] h-[48px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-col gap-2 w-full mb-6 pt-6">
          <Text className="text-3xl text-neutral-900 font-semibold text-center">
            Sign Up
          </Text>
          <Text className="text-neutral-400 text-center text-lg">
            Create your account as a tenant or landlord
          </Text>
        </View>

        <View className="mt-4 mb-6">
          <Text className="text-lg font-semibold">
            Which user best describes you?
          </Text>

          <View className="flex-row gap-4 mt-2">
            {/* Tenant Option */}
            <TouchableOpacity
              onPress={() => setSelected("Tenant")}
              activeOpacity={0.5}
              className="flex-row items-center gap-2"
            >
              <View
                className={`size-4 rounded-md border ${
                  selected === "Tenant"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              />
              <Text
                className={`text-sm ${
                  selected === "Tenant"
                    ? "text-neutral-900"
                    : "text-neutral-500"
                }`}
              >
                Tenant
              </Text>
            </TouchableOpacity>

            {/* Landlord Option */}
            <TouchableOpacity
              onPress={() => setSelected("Landlord")}
              activeOpacity={0.5}
              className="flex-row items-center gap-2"
            >
              <View
                className={`size-4 rounded-md border ${
                  selected === "Landlord"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              />
              <Text
                className={`text-sm ${
                  selected === "Tenant"
                    ? "text-neutral-900"
                    : "text-neutral-500"
                }`}
              >
                Landlord
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* form components */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-col gap-4">
              <View className="w-full gap-1">
                <Text className="text-base">Full Name</Text>
                <TextInput
                  placeholder="eg: John Doe"
                  value={fullName}
                  onChangeText={setfullName}
                  className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
                  keyboardType="default"
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View className="w-full gap-1">
                <Text className="text-base">E-mail</Text>
                <TextInput
                  placeholder="eg: me@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone number Input */}
              <View className="w-full gap-1">
                <Text className="text-base">Phone Number</Text>
                <TextInput
                  placeholder="eg: +44 848 9390 8999"
                  value={email}
                  onChangeText={setEmail}
                  className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="w-full gap-1">
                <Text className="text-base">Create Password</Text>

                <View className="relative">
                  <TextInput
                    placeholder="Enter password here"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 pl-3.5 pr-12 h-[44px]"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    className="absolute right-3 inset-y-2.5"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#667085"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* confirm password */}
              <View className="w-full gap-1">
                <Text className="text-base">Confirm Password</Text>

                <View className="relative">
                  <TextInput
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 pl-3.5 pr-12 h-[44px]"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                    className="absolute right-3 inset-y-2.5"
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#667085"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/* Continue Button */}
          <View className="mt-10">
            <Button
              label="Sign Up"
              onPress={() => router.push("/auth/verify")}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-xl"
            />

            <View className="flex-row gap-1 mt-4 justify-center">
              <Text className="text-neutral-500">Don’t have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/auth")}
                activeOpacity={0.7}
              >
                <Text className="text-primary-500 font-semibold underline">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* or */}
        <View className="flex-row items-center my-4 px-6">
          <View className="flex-1 h-px bg-neutral-300" />
          <Text className="mx-2 text-neutral-500">or</Text>
          <View className="flex-1 h-px bg-neutral-300" />
        </View>

        {/* social login */}
        <View className="gap-4">
          <Button
            label="Sign Up with Google"
            onPress={() => console.log("Google Sign Up")}
            iconImage={require("@/assets/images/google.png")}
            style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
            textStyle="font-bold text-neutral-900 text-xl"
          />

          <Button
            label="Sign Up with Apple"
            onPress={() => console.log("Apple Sign Up")}
            iconImage={require("@/assets/images/apple.png")}
            style="bg-black p-3 rounded-full w-full"
            textStyle="font-bold text-white text-xl"
          />
        </View>

        {/* terms */}
        <View className="flex-row w-full flex-wrap justify-center gap-x-1 gap-y-0 mt-4">
          <Text className="text-center text-base text-neutral-500">
            By clicking 'Sign Up', You agree to our
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-primary-500">Terms of Service</Text>
          </TouchableOpacity>
          <Text className="text-center text-base text-neutral-500">and</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-primary-500">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style={Platform.OS === "ios" ? "auto" : "dark"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

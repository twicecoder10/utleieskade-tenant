import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/store/store";
import { updateUser, setLoggedIn } from "@/slice/userSlice";
import { StatusBar } from "expo-status-bar";
import { useLoginMutation } from "@/slice/auth/index.service";

const SignInScreen = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    setErrorMessage("");

    if (!userEmail || !userPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    console.log("Logging in with:", { userEmail, userPassword });

    try {
      const response = await login({ userEmail, userPassword }).unwrap();
      const { token, user } = response?.data || response;

      // Store token (use "token" to match baseQuery)
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userToken", token); // Also store as userToken for compatibility
      await AsyncStorage.setItem("isLoggedIn", "true");

      dispatch(updateUser(user || response?.data));
      dispatch(setLoggedIn(true));

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login Error:", error);

      Alert.alert(
        "Login Failed",
        // error?.data?.message || "Invalid email or password. Please try again.",
        error?.data?.message || "An error occurred. Please try again.",
        [{ text: "OK" }]
      );

      setErrorMessage("Invalid email or password. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

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
            Sign In
          </Text>
        </View>

        {/* form components */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-col gap-4">
              {/* Email Input */}
              <View className="w-full gap-1">
                <Text className="text-base">E-mail</Text>
                <TextInput
                  placeholder="Email Address"
                  value={userEmail}
                  onChangeText={setUserEmail}
                  className="text-base text-black rounded-xl border border-neutral-400 py-2 pl-3.5 pr-12 h-[44px] focus:border-black"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="w-full gap-1">
                <Text className="text-base">Password</Text>

                <View className="relative">
                  <TextInput
                    placeholder="Password"
                    value={userPassword}
                    onChangeText={setUserPassword}
                    secureTextEntry={!showPassword}
                    className="text-base text-black rounded-xl border border-neutral-400 py-2 pl-3.5 pr-12 h-[44px] focus:border-black"
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

                  <View className="flex-row justify-end gap-1 mt-2">
                    <TouchableOpacity
                      onPress={() => router.push("/auth/forgot-password")}
                      activeOpacity={0.7}
                    >
                      <Text className="text-sm text-neutral-500 font-medium">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {/* erorr message */}
        {errorMessage ? (
          <Text className="text-red-500 text-center mt-2">{errorMessage}</Text>
        ) : null}

        {/* Continue Button */}
        <View className="mt-10">
          <Button
            label={isLoading ? <ActivityIndicator color="#FFF" /> : "Sign In"}
            onPress={handleLogin}
            disabled={isLoading}
            style="bg-primary-500 p-3 rounded-full w-full flex items-center justify-center"
            textStyle="font-bold text-white text-xl"
          />

          <View className="flex-row gap-1 mt-4 justify-center">
            <Text className="text-neutral-500">Don’t have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/signup")}
              activeOpacity={0.7}
            >
              <Text className="text-primary-500 font-semibold underline">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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

export default SignInScreen;

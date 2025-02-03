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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createPassword, setCreatePassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Password" showBack />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-col gap-4 mt-6">
              {/* Password Input */}
              <View className="w-full gap-1">
                <Text className="text-base">Password</Text>

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
                <Text className="text-base">Create New Password</Text>

                <View className="relative">
                  <TextInput
                    placeholder="New password"
                    value={createPassword}
                    onChangeText={setCreatePassword}
                    secureTextEntry={!showCreatePassword}
                    className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 pl-3.5 pr-12 h-[44px]"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCreatePassword(!showCreatePassword)}
                    activeOpacity={0.7}
                    className="absolute right-3 inset-y-2.5"
                  >
                    <Ionicons
                      name={
                        showCreatePassword ? "eye-off-outline" : "eye-outline"
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
              label="Change password"
              onPress={() => router.push("/auth")}
              style="bg-primary-500 p-3 rounded-full w-full disabled:opacity-50"
              textStyle="font-bold text-white text-xl"
              disabled={!password || !createPassword}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

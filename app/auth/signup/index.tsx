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
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import {
  useRegisterMutation,
  useRequestOtpMutation,
} from "@/slice/auth/index.service";

const SignupScreen = () => {
  const [userType, setUserType] = useState<"tenant" | "landlord">("tenant");

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userPostcode, setUserPostcode] = useState("");
  const [userCountry, setUserCountry] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();

  const handleSignup = async () => {
    if (
      !userFirstName ||
      !userLastName ||
      !userEmail ||
      !userPhone ||
      !userPassword ||
      !confirmPassword ||
      !userAddress ||
      !userCity ||
      !userPostcode ||
      !userCountry ||
      !userType
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (userPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userData = {
        userFirstName,
        userLastName,
        userEmail,
        userPhone,
        userPassword,
        userAddress,
        userCity,
        userPostcode,
        userCountry,
        userType,
      };

      const response = await register(userData).unwrap();

      if (response?.data?.token) {
        // Request OTP
        await requestOtp({ email: userEmail }).unwrap();
        router.push(`/auth/verify?email=${userEmail}`);
      }
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error?.data?.message || "Something went wrong"
      );
      console.error("Signup Error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                {[
                  { label: "Tenant", value: "tenant" },
                  { label: "Landlord", value: "landlord" },
                ].map((role) => (
                  <TouchableOpacity
                    key={role.label}
                    onPress={() =>
                      setUserType(role.value as "tenant" | "landlord")
                    }
                    activeOpacity={0.5}
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`size-4 rounded-md border ${
                        userType === role.value
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                    <Text
                      className={`text-sm ${
                        userType === role.value
                          ? "text-neutral-900"
                          : "text-neutral-500"
                      }`}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* form components */}
            <View className="flex-col gap-4">
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <InputField
                    label="First Name"
                    value={userFirstName}
                    onChangeText={setUserFirstName}
                    placeholder="John"
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    label="Last Name"
                    value={userLastName}
                    onChangeText={setUserLastName}
                    placeholder="Doe"
                  />
                </View>
              </View>

              <InputField
                label="Email"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="me@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Phone Number"
                value={userPhone}
                onChangeText={setUserPhone}
                placeholder="+44 848 9390 8999"
                keyboardType="phone-pad"
              />

              <InputField
                label="Address"
                value={userAddress}
                onChangeText={setUserAddress}
                placeholder="123 Main Street"
              />

              <View className="flex-row gap-2">
                <View className="flex-1">
                  <InputField
                    label="City"
                    value={userCity}
                    onChangeText={setUserCity}
                    placeholder="London"
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    label="Postcode"
                    value={userPostcode}
                    onChangeText={setUserPostcode}
                    placeholder="S12 2IS"
                  />
                </View>
              </View>

              <InputField
                label="Country"
                value={userCountry}
                onChangeText={setUserCountry}
                placeholder="UK"
              />

              <PasswordField
                label="Create Password"
                value={userPassword}
                onChangeText={setUserPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
            </View>

            {/* Continue Button */}
            <View className="mt-10">
              <Button
                label={
                  isRegistering || isRequestingOtp ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    "Sign Up"
                  )
                }
                onPress={handleSignup}
                disabled={isRegistering || isRequestingOtp}
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
              <Text className="text-center text-base text-neutral-500">
                and
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-primary-500">Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <StatusBar style={Platform.OS === "ios" ? "auto" : "dark"} />
    </SafeAreaView>
  );
};

const InputField = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) => (
  <View className="w-full gap-1">
    <Text className="text-base">{label}</Text>
    <TextInput
      className="text-base text-neutral-400 rounded-xl border border-neutral-400 py-2 px-3.5 h-[44px]"
      {...props}
    />
  </View>
);

const PasswordField = ({
  label,
  value,
  onChangeText,
  showPassword,
  setShowPassword,
}: any) => (
  <View className="w-full gap-1">
    <Text className="text-base">{label}</Text>
    <View className="relative">
      <TextInput
        placeholder="Enter password"
        value={value}
        onChangeText={onChangeText}
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
);

export default SignupScreen;

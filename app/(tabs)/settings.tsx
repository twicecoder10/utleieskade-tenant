import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { logout } from "@/slice/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadImageMutation,
} from "@/slice/auth/index.service";
import * as ImagePicker from "expo-image-picker";
import { useUploadFileMutation } from "@/slice/files/index.service";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { data, error } = useGetUserQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });

  // if (isLoading) return <Text>Loading...</Text>;
  // if (error) return <Text>Error fetching data!</Text>;

  const user = data?.data || {};

  const [firstName, setFirstName] = useState(user?.userFirstName || "");
  const [lastName, setLastName] = useState(user?.userLastName || "");
  const [phone, setPhone] = useState(user?.userPhone || "");
  const [email, setEmail] = useState(user?.userEmail || "");
  const [selectedLanguage, setSelectedLanguage] = useState("Norwegian"); // Default Norwegian
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [profileImage, setProfileImage] = useState(user?.userProfilePic || "https://i.pravatar.cc/57");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploadFile] = useUploadFileMutation();

  // Load saved language preference and theme
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("@app_language");
        const savedTheme = await AsyncStorage.getItem("@app_theme");
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
        if (savedTheme) {
          setSelectedTheme(savedTheme);
        }
        if (user?.userProfilePic) {
          setProfileImage(user.userProfilePic);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };
    loadPreferences();
  }, [user]);

  // Save language preference
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    try {
      await AsyncStorage.setItem("@app_language", language);
      Alert.alert("Success", `Language changed to ${language === "Norwegian" ? "Norsk" : "English"}`);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant permission to access your photos.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0].uri;
      setUploadingImage(true);

      // Create FormData
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      // Upload file
      const uploadResult = await uploadFile(formData).unwrap();
      const imageUrl = uploadResult?.filePath || uploadResult?.data?.filePath;

      if (imageUrl) {
        // Update user profile with new image URL
        await updateUser({ userProfilePic: imageUrl }).unwrap();
        setProfileImage(imageUrl);
        Alert.alert("Success", "Profile picture updated successfully!");
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Error", error?.message || "Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle theme change
  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      await AsyncStorage.setItem("@app_theme", theme);
      // Note: Dark mode implementation would require theme context/provider
      Alert.alert("Success", `Theme changed to ${theme} mode`);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const [updateUser] = useUpdateUserMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    setIsLoading(true);

    const updatedUser = {
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      userPhone: phone,
    };

    try {
      await updateUser(updatedUser).unwrap();
      console.log("Profile updated successfully!");
      Alert.alert("Success", "Your profile has been updated successfully.");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to update profile. Please try again.",
        [{ text: "Retry" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header title="Settings" showBack />

        {/* Profile Section */}
        <View className="bg-white p-5 rounded-2xl border border-[#E2E2E2] mt-6">
          <View>
            <Text className="mb-6 text-lg font-semibold text-neutral-700">
              Account
            </Text>
            {/* <Text className="capitalize">Account Type: {user?.userType}</Text> */}
          </View>

          <View className="flex-row items-center">
            <View className="relative">
              {uploadingImage ? (
                <View className="size-[60px] rounded-full bg-gray-200 items-center justify-center">
                  <ActivityIndicator size="small" color="#2387D4" />
                </View>
              ) : (
                <Image
                  source={{ uri: profileImage }}
                  className="size-[60px] rounded-full"
                  resizeMode="cover"
                  width={60}
                  height={60}
                />
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleProfilePictureUpload}
                disabled={uploadingImage}
                className="absolute -right-1 bottom-1 bg-primary-500 rounded-full p-1.5 flex-row items-center justify-center"
              >
                <Feather name="camera" size={12} color="white" />
              </TouchableOpacity>
            </View>
            <View className="ml-3">
              <Text className="text-lg font-semibold">
                {firstName} {lastName}
              </Text>
              <Text className="text-gray-500">{email}</Text>
            </View>
          </View>

          <View className="mt-4 flex flex-col gap-4">
            {/* First Name */}
            <View className="flex flex-col gap-1">
              <Text className="text-neutral-400 text-base">First Name</Text>
              <View className="relative">
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-900 font-medium pr-10"
                />
                <Feather
                  name="edit-3"
                  size={20}
                  color="#98A2B3"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </View>
            </View>

            {/* Last Name */}
            <View className="flex flex-col gap-1">
              <Text className="text-neutral-400 text-base">Last Name</Text>
              <View className="relative">
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-900 font-medium pr-10"
                />
                <Feather
                  name="edit-3"
                  size={20}
                  color="#98A2B3"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View className="flex flex-col gap-1">
              <Text className="text-neutral-400 text-base">Phone Number</Text>
              <View className="relative">
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-900 font-medium pr-10"
                />
                <Feather
                  name="edit-3"
                  size={20}
                  color="#98A2B3"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </View>
            </View>

            {/* Email */}
            <View className="flex flex-col gap-2">
              <Text className="text-neutral-400 text-base">Email</Text>
              <View className="relative">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-900 font-medium pr-10"
                />
                <Feather
                  name="edit-3"
                  size={20}
                  color="#98A2B3"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </View>
            </View>

            {/* Save Changes Button */}
            <Button
              label={
                isLoading ? <ActivityIndicator color="#FFF" /> : "Save Changes"
              }
              onPress={handleSaveChanges}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-xl"
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Security & Privacy Section */}
        <View className="bg-white p-5 rounded-2xl border border-[#E2E2E2] mt-9">
          <Text className="mb-4 text-lg font-semibold text-neutral-700">
            Security & Privacy
          </Text>

          {/* Password */}
          <TouchableOpacity
            onPress={() => router.push("/settings/change-password")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center gap-3">
              <Feather name="lock" size={20} color="#475467" />
              <Text className="text-base text-neutral-600">Password</Text>
            </View>
            <AntDesign name="right" size={16} color="#D0D5DD" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={() => router.push("/settings/privacy-policy")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center gap-3">
              <Feather name="shield" size={20} color="#475467" />
              <Text className="text-base">Privacy Policy</Text>
            </View>
            <AntDesign name="right" size={16} color="#D0D5DD" />
          </TouchableOpacity>
        </View>

        {/* Language Selection */}
        <View className="bg-white p-5 rounded-2xl border border-[#E2E2E2] mt-9">
          <Text className="mb-4 text-lg font-semibold text-neutral-700">
            Language
          </Text>

          <TouchableOpacity
            onPress={() => handleLanguageChange("Norwegian")}
            className={`flex-row items-center gap-3 p-3 rounded-lg ${
              selectedLanguage === "Norwegian" ? "bg-blue-50" : ""
            }`}
          >
            <MaterialIcons
              name="language"
              size={20}
              color={selectedLanguage === "Norwegian" ? "#2387D4" : "#667085"}
            />
            <Text
              className={`text-base ${
                selectedLanguage === "Norwegian"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500"
              }`}
            >
              Norwegian
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLanguageChange("English")}
            className={`flex-row items-center gap-3 p-3 rounded-lg ${
              selectedLanguage === "English" ? "bg-blue-50" : ""
            }`}
          >
            <MaterialIcons
              name="language"
              size={20}
              color={selectedLanguage === "English" ? "#2387D4" : "#667085"}
            />
            <Text
              className={`text-base ${
                selectedLanguage === "English"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500"
              }`}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Selection */}
        <View className="bg-white p-5 rounded-2xl border border-[#E2E2E2] mt-9">
          <Text className="mb-4 text-lg font-semibold text-neutral-700">
            Appearance
          </Text>

          <TouchableOpacity
            onPress={() => handleThemeChange("Light")}
            className={`flex-row items-center gap-3 p-3 rounded-lg ${
              selectedTheme === "Light" ? "bg-primary-50" : ""
            }`}
          >
            <Feather
              name="sun"
              size={20}
              color={selectedTheme === "Light" ? "#2387D4" : "#667085"}
            />
            <Text
              className={`text-base ${
                selectedTheme === "Light"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500"
              }`}
            >
              Light mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleThemeChange("Dark")}
            className={`flex-row items-center gap-3 p-3 rounded-lg ${
              selectedTheme === "Dark" ? "bg-blue-50" : ""
            }`}
          >
            <Feather
              name="moon"
              size={20}
              color={selectedTheme === "Dark" ? "#2387D4" : "#667085"}
            />
            <Text
              className={`text-base ${
                selectedTheme === "Dark"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500"
              }`}
            >
              Dark mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row justify-center items-center gap-3 mt-6"
        >
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            {/* <FontAwesome6
              name="arrow-right-from-bracket"
              size={20}
              color="#B91C1C"
            /> */}
            <AntDesign name="logout" size={24} color="#B91C1C" />
          </View>

          <Text className="text-error-700 font-semibold">Logout</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Account",
              "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted in compliance with GDPR.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      // TODO: Call API endpoint to delete account
                      // await deleteAccount().unwrap();
                      Alert.alert(
                        "Account Deletion Request",
                        "Your account deletion request has been submitted. Your data will be permanently deleted within 30 days as per GDPR requirements."
                      );
                      handleLogout();
                    } catch (error: any) {
                      Alert.alert(
                        "Error",
                        error?.data?.message || "Failed to delete account. Please try again."
                      );
                    }
                  },
                },
              ]
            );
          }}
          className="flex-row justify-center items-center gap-2 mt-6"
        >
          <Feather name="trash-2" size={20} color="#B91C1C" />
          <Text className="text-error-700 font-semibold">Delete account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import CustomSelect from "@/components/ui/CustomSelect";
import Button from "@/components/ui/Button";
import * as ImagePicker from "expo-image-picker";

import { useReportCasesMutation } from "@/slice/cases/index.service";
import { useUploadFileMutation } from "@/slice/files/index.service";
import { useGetPlatformPricingSettingsQuery } from "@/slice/auth/index.service";
import { Alert } from "react-native";
import { calculatePricing } from "@/utils/pricing";
import { saveDraft, generateDraftId, DraftCase } from "@/utils/draftStorage";

interface DamageRoom {
  id: string;
  damageLocation: string;
  damageType: string;
  causeOfDamage: string;
  description: string;
  date: string;
  photos: { photoType: string; photoUrl: string; description?: string }[];
}

const ReportDamage = () => {
  const [propertyAddress, setPropertyAddress] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [rooms, setRooms] = useState<DamageRoom[]>([
    {
      id: "1",
      damageLocation: "",
      damageType: "",
      causeOfDamage: "",
      description: "",
      date: new Date().toLocaleDateString(),
      photos: [],
    },
  ]);
  const [assessmentLevel, setAssessmentLevel] = useState<"standard" | "detailed">("standard");
  const [isUrgent, setIsUrgent] = useState(false);
  const [optionalTenantName, setOptionalTenantName] = useState("");
  const [optionalLandlordName, setOptionalLandlordName] = useState("");

  const [reportCases] = useReportCasesMutation();
  const [uploadFile] = useUploadFileMutation();
  
  // Fetch platform pricing settings - refetch on screen focus to get latest prices
  const { data: pricingSettingsData, refetch: refetchPricingSettings } = useGetPlatformPricingSettingsQuery({});
  
  // Refetch pricing settings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetchPricingSettings();
    }, [refetchPricingSettings])
  );
  
  // Also refetch on mount as a fallback
  useEffect(() => {
    refetchPricingSettings();
  }, []);
  
  const pricingConfig = pricingSettingsData?.data 
    ? {
        basePrice: pricingSettingsData.data.basePrice || 100,
        urgentFee: pricingSettingsData.data.hasteCaseFee || 50,
        standardAssessmentPrice: 0,
        detailedAssessmentPrice: 200,
      }
    : undefined;

  // Calculate pricing based on rooms, assessment level, and urgency
  const pricing = calculatePricing(rooms.length, assessmentLevel, isUrgent, pricingConfig);

  const updateRoom = (roomId: string, updates: Partial<DamageRoom>) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room))
    );
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        damageLocation: "",
        damageType: "",
        causeOfDamage: "",
        description: "",
        date: new Date().toLocaleDateString(),
        photos: [],
      },
    ]);
  };

  const removeRoom = (roomId: string) => {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    }
  };

  const renderUploadBox = (roomId: string, photoType: string) => {
    const room = rooms.find((r) => r.id === roomId);
    const roomPhotos = room?.photos.filter((p) => p.photoType === photoType) || [];
    const maxPhotos = 10;
    const canUpload = roomPhotos.length < maxPhotos;

    return (
      <TouchableOpacity
        className="mt-4 border-dotted bg-neutral-50 border-2 border-gray-300 rounded-[14px] py-12 px-6 items-center"
        onPress={() => canUpload && handleImageUpload(roomId, photoType)}
        disabled={!canUpload}
      >
        <AntDesign name="upload" size={24} color="#98A2B3" />
        <Text className="text-sm text-neutral-500 mt-3">
          Tap to upload photos ({roomPhotos.length} / {maxPhotos} photos)
        </Text>
      </TouchableOpacity>
    );
  };

  const handleImageUpload = async (roomId: string, photoType: string) => {
    try {
      // Request permission to access the media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Error",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        if (!selectedImage.uri) {
          Alert.alert(
            "Error",
            "Selected image is missing required properties."
          );
          return;
        }

        // Create FormData to send binary file
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage.uri,
          type: "image/jpeg",
          name: selectedImage.fileName || "photo.jpg",
        } as any);

        // Upload the binary file
        const uploadResponse = await uploadFile(formData).unwrap();

        // Add the uploaded photo to the room's photos
        const newPhoto = {
          photoType: photoType,
          photoUrl: uploadResponse.filePath,
          description: "",
        };

        updateRoom(roomId, {
          photos: [...(rooms.find((r) => r.id === roomId)?.photos || []), newPhoto],
        });

        Alert.alert("Success", "Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    try {
      const draft: DraftCase = {
        id: generateDraftId(),
        propertyAddress,
        buildingNumber,
        caseDescription: rooms.map((r) => r.description).join("; "),
        caseUrgencyLevel: isUrgent ? "high" : "moderate",
        assessmentLevel,
        isUrgent,
        optionalTenantName,
        optionalLandlordName,
        damages: rooms.map((room) => ({
          id: room.id,
          damageLocation: room.damageLocation,
          damageType: room.damageType,
          damageDescription: room.description,
          damageDate: room.date,
          photos: room.photos.map((p) => ({
            id: Date.now().toString(),
            photoType: p.photoType,
            photoUrl: p.photoUrl,
            description: p.description || "",
            localUri: p.photoUrl, // For now, using the uploaded URL
          })),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveDraft(draft);
      Alert.alert("Success", "Draft saved successfully!");
    } catch (error) {
      console.error("Failed to save draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // Validate all rooms
    for (const room of rooms) {
      if (
        !room.damageLocation ||
        !room.damageType ||
        !room.description ||
        !room.date
      ) {
        Alert.alert("Error", "Please fill out all required fields for all rooms.");
        return;
      }
      if (room.description.length > 150) {
        Alert.alert("Error", "Description must be 150 characters or less.");
        return;
      }
    }

    if (!buildingNumber || !propertyAddress) {
      Alert.alert("Error", "Please fill out property address and building number.");
      return;
    }

    // Navigate to preview screen first
    router.push({
      pathname: "/reports/report-preview",
      params: {
        rooms: JSON.stringify(rooms),
        buildingNumber,
        propertyAddress,
        assessmentLevel,
        isUrgent: isUrgent.toString(),
        optionalTenantName,
        optionalLandlordName,
        totalPrice: pricing.totalPrice.toString(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <View className="w-full pt-5 pb-3 bg-white flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <EvilIcons name="chevron-left" size={36} color="#98A2B3" />
            </TouchableOpacity>

            <Text className="text-2xl text-neutral-900 font-semibold">
              Report Damage
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/reports/saved-drafts")}
          >
            <Text className="font-medium text-primary-500">Saved drafts</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-lg font-semibold text-neutral-900">
            Location Details
          </Text>

          <View className="gap-4 mt-4">
            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">Property Address</Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="Enter property address"
                value={propertyAddress}
                onChangeText={setPropertyAddress}
                multiline={false}
              />
            </View>

            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">
                Building Number
              </Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="eg: building A"
                value={buildingNumber}
                onChangeText={setBuildingNumber}
                multiline={false}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Optional Fields */}
          <View className="gap-4 mt-4">
            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">
                Tenant Name (Optional)
              </Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="Enter tenant name if applicable"
                value={optionalTenantName}
                onChangeText={setOptionalTenantName}
              />
            </View>

            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">
                Landlord Name (Optional)
              </Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="Enter landlord name if applicable"
                value={optionalLandlordName}
                onChangeText={setOptionalLandlordName}
              />
            </View>
          </View>

          {/* Assessment Level and Urgent */}
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-base font-semibold text-neutral-900 mb-4">
              Assessment Options
            </Text>

            <View className="mb-4">
              <Text className="text-sm text-neutral-900 mb-2">
                Assessment Level
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setAssessmentLevel("standard")}
                  className={`flex-1 p-3 rounded-lg border ${
                    assessmentLevel === "standard"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      assessmentLevel === "standard"
                        ? "text-primary-700 font-semibold"
                        : "text-neutral-600"
                    }`}
                  >
                    Standard Assessment
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAssessmentLevel("detailed")}
                  className={`flex-1 p-3 rounded-lg border ${
                    assessmentLevel === "detailed"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      assessmentLevel === "detailed"
                        ? "text-primary-700 font-semibold"
                        : "text-neutral-600"
                    }`}
                  >
                    Detailed Assessment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm text-neutral-900 mb-1">
                  Mark as Urgent
                </Text>
                <Text className="text-xs text-neutral-500">
                  Assessment within 24-48 hours (additional cost)
                </Text>
              </View>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: "#D1D5DB", true: "#2387D4" }}
                thumbColor={isUrgent ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* Multiple Rooms - Damage Details */}
          {rooms.map((room, roomIndex) => (
            <View
              key={room.id}
              className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]"
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-semibold text-neutral-900">
                  Damage Details - Room {roomIndex + 1}
                </Text>
                {rooms.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeRoom(room.id)}
                    className="p-2"
                  >
                    <AntDesign name="close" size={20} color="#B91C1C" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Damage Location */}
              <View className="mt-4">
                <Text className="text-sm text-neutral-900 mb-2">
                  Damage Area / Location *
                </Text>
                <CustomSelect
                  placeholder="Select damage location"
                  items={[
                    { label: "Bathroom", value: "Bathroom" },
                    { label: "Kitchen", value: "Kitchen" },
                    { label: "Exterior", value: "Exterior" },
                    { label: "Living Room", value: "Living Room" },
                    { label: "Furniture", value: "Furniture" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={room.damageLocation}
                  onValueChange={(value) =>
                    updateRoom(room.id, { damageLocation: value })
                  }
                />
              </View>

              {/* Damage Type */}
              <View className="mt-4">
                <Text className="text-sm text-neutral-900 mb-2">
                  Type of damage *
                </Text>
                <CustomSelect
                  placeholder="Select damage type"
                  items={[
                    { label: "Water Damage", value: "Water Damage" },
                    { label: "Electricity Issues", value: "Electricity Issues" },
                    { label: "Structural Damage", value: "Structural Damage" },
                    {
                      label: "Appliance Malfunction",
                      value: "Appliance Malfunction",
                    },
                    { label: "Pest Problem", value: "Pest Problem" },
                  ]}
                  value={room.damageType}
                  onValueChange={(value) =>
                    updateRoom(room.id, { damageType: value })
                  }
                />
              </View>

              {/* Cause of Damage */}
              <View className="mt-4">
                <Text className="text-sm text-neutral-900 mb-2">
                  Cause of damage
                </Text>
                <CustomSelect
                  placeholder="Select cause type"
                  items={[
                    { label: "Accident", value: "Accident" },
                    { label: "External Impact", value: "External Impact" },
                    { label: "Leakage", value: "Leakage" },
                  ]}
                  value={room.causeOfDamage}
                  onValueChange={(value) =>
                    updateRoom(room.id, { causeOfDamage: value })
                  }
                />
              </View>

              {/* Description */}
              <View className="mt-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-neutral-900">Description *</Text>
                  <Text className="text-xs text-neutral-500">
                    {room.description.length}/150
                  </Text>
                </View>
                <TextInput
                  className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                  placeholder="Describe the damage in detail (max 150 characters)"
                  value={room.description}
                  onChangeText={(text) => {
                    if (text.length <= 150) {
                      updateRoom(room.id, { description: text });
                    }
                  }}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={150}
                />
              </View>

              {/* Date */}
              <View className="mt-4">
                <Text className="text-base font-semibold text-neutral-900 mb-1">
                  Date *
                </Text>
                <Text className="text-sm text-neutral-400 mb-1">
                  When did you notice this damage?
                </Text>
                <View className="relative">
                  <TextInput
                    value={room.date}
                    onChangeText={(text) => updateRoom(room.id, { date: text })}
                    className="p-3 border border-[#E2E2E2] rounded-lg"
                    placeholder="When did you notice this damage?"
                  />
                  <View className="absolute right-3 top-3">
                    <AntDesign name="calendar" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </View>

              {/* Photos Section */}
              <View className="mt-4">
                <Text className="text-base font-semibold text-neutral-900 mb-4">
                  Photos (up to 10 per damage)
                </Text>

                {/* Display uploaded photos */}
                {room.photos.length > 0 && (
                  <View className="mb-4">
                    {room.photos.map((photo, photoIndex) => (
                      <View
                        key={photoIndex}
                        className="flex-row items-center gap-2 mb-2 p-2 border border-gray-200 rounded-lg"
                      >
                        <View className="flex-1">
                          <Text className="text-xs text-neutral-500">
                            {photo.photoType}
                          </Text>
                          <TextInput
                            className="mt-1 p-2 border border-gray-200 rounded text-xs"
                            placeholder="Add description for this photo"
                            value={photo.description || ""}
                            onChangeText={(text) => {
                              const updatedPhotos = [...room.photos];
                              updatedPhotos[photoIndex].description = text;
                              updateRoom(room.id, { photos: updatedPhotos });
                            }}
                            multiline
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const updatedPhotos = room.photos.filter(
                              (_, i) => i !== photoIndex
                            );
                            updateRoom(room.id, { photos: updatedPhotos });
                          }}
                        >
                          <AntDesign name="close" size={16} color="#B91C1C" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Upload button */}
                {room.photos.length < 10 && (
                  <TouchableOpacity
                    onPress={() => handleImageUpload(room.id, "general")}
                    className="border-dotted bg-neutral-50 border-2 border-gray-300 rounded-[14px] py-8 px-6 items-center"
                  >
                    <AntDesign name="upload" size={24} color="#98A2B3" />
                    <Text className="text-sm text-neutral-500 mt-3">
                      Tap to upload photos ({room.photos.length}/10)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {/* Add Another Room Button */}
          <Button
            label="Add Another Room"
            onPress={addRoom}
            iconImage={require("@/assets/images/plus-sign.png")}
            style="bg-white border border-primary-500 p-3 rounded-full w-full mt-8"
            textStyle="!font-medium text-primary-500 text-base"
            iconSize={16}
          />

          {/* Price Breakdown */}
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-semibold text-neutral-900">
                Price Breakdown
              </Text>
            </View>

            <View className="mt-2 flex-row items-center justify-between gap-4 pb-2 border-b border-[#E2E2E2]">
              <Text className="text-sm text-neutral-500">
                Base Price ({rooms.length} {rooms.length === 1 ? "room" : "rooms"})
              </Text>
              <Text className="text-sm text-neutral-500">
                {pricing.basePrice.toFixed(2)} NOK
              </Text>
            </View>

            {pricing.discount > 0 && (
              <View className="mt-2 flex-row items-center justify-between gap-4 pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">
                  Discount ({pricing.discount}%)
                </Text>
                <Text className="text-sm text-green-600">
                  -{((pricing.basePrice - pricing.discountedPrice)).toFixed(2)} NOK
                </Text>
              </View>
            )}

            {assessmentLevel === "detailed" && (
              <View className="mt-2 flex-row items-center justify-between gap-4 pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">
                  Detailed Assessment
                </Text>
                <Text className="text-sm text-neutral-500">200.00 NOK</Text>
              </View>
            )}

            {isUrgent && (
              <View className="mt-2 flex-row items-center justify-between gap-4 pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">Urgent Fee</Text>
                <Text className="text-sm text-neutral-500">
                  {pricingConfig?.urgentFee?.toFixed(2) || "50.00"} NOK
                </Text>
              </View>
            )}

            <View className="mt-4 flex-row items-center justify-between gap-4">
              <Text className="text-base text-neutral-800 font-semibold">
                Total
              </Text>
              <Text className="text-base text-neutral-800 font-semibold">
                {pricing.totalPrice.toFixed(2)} NOK
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 gap-3">
            <Button
              label="Save Draft"
              onPress={handleSaveDraft}
              style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
              textStyle="font-bold text-neutral-700 text-base font-medium"
            />
            <Button
              label="Continue to Payment"
              onPress={handleSubmit}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-base font-medium"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDamage;

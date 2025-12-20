import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import { calculatePricing } from "@/utils/pricing";
import { getApiUrl } from "@/utils/apiUrl";
import { useGetPlatformPricingSettingsQuery } from "@/slice/auth/index.service";

const ReportPreview = () => {
  const params = useLocalSearchParams();
  const [imageViewer, setImageViewer] = useState<{
    open: boolean;
    imageUrl: string;
  }>({ open: false, imageUrl: "" });

  // Get data from params or use default
  const rooms = params.rooms ? JSON.parse(params.rooms as string) : [];
  const buildingNumber = params.buildingNumber as string;
  const propertyAddress = params.propertyAddress as string;
  const assessmentLevel = (params.assessmentLevel as "standard" | "detailed") || "standard";
  const isUrgent = params.isUrgent === "true";
  const optionalTenantName = params.optionalTenantName as string;
  const optionalLandlordName = params.optionalLandlordName as string;
  const totalPrice = parseFloat(params.totalPrice as string) || 0;

  // Fetch platform pricing settings
  const { data: pricingSettingsData } = useGetPlatformPricingSettingsQuery({});
  const pricingConfig = pricingSettingsData?.data 
    ? {
        basePrice: pricingSettingsData.data.basePrice || 100,
        urgentFee: pricingSettingsData.data.hasteCaseFee || 50,
        standardAssessmentPrice: 0,
        detailedAssessmentPrice: 200,
      }
    : undefined;

  const pricing = calculatePricing(rooms.length, assessmentLevel, isUrgent, pricingConfig);

  const handleEdit = () => {
    router.back();
  };

  const handleProceedToPayment = () => {
    router.push({
      pathname: "/reports/assessment-payment",
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

  const openImageViewer = (imageUrl: string) => {
    setImageViewer({ open: true, imageUrl });
  };

  const closeImageViewer = () => {
    setImageViewer({ open: false, imageUrl: "" });
  };

  if (rooms.length === 0) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Report Preview" showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-neutral-500">No case data to preview</Text>
          <Button
            label="Go Back"
            onPress={() => router.back()}
            style="bg-primary-500 p-3 rounded-full w-full mt-4"
            textStyle="font-bold text-white text-base"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <View className="w-full pt-5 pb-3 bg-white flex-row justify-between items-center">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <EvilIcons name="chevron-left" size={36} color="#98A2B3" />
            </TouchableOpacity>
            <Text className="text-2xl text-neutral-900 font-semibold">
              Report Preview
            </Text>
          </View>
        </View>

        {/* Location Details */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-neutral-900">
            Location Details
          </Text>

          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-neutral-500">Property Address:</Text>
                <Text className="text-sm text-neutral-900 font-medium">
                  {propertyAddress || "Not specified"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-neutral-500">Building Number:</Text>
                <Text className="text-sm text-neutral-900 font-medium">
                  {buildingNumber || "Not specified"}
                </Text>
              </View>
              {optionalTenantName && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-neutral-500">Tenant Name:</Text>
                  <Text className="text-sm text-neutral-900 font-medium">
                    {optionalTenantName}
                  </Text>
                </View>
              )}
              {optionalLandlordName && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-neutral-500">Landlord Name:</Text>
                  <Text className="text-sm text-neutral-900 font-medium">
                    {optionalLandlordName}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Assessment Options */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-base font-semibold text-neutral-900 mb-3">
            Assessment Options
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Assessment Level:</Text>
              <Text className="text-sm text-neutral-900 font-medium capitalize">
                {assessmentLevel}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-500">Urgent:</Text>
              <Text className={`text-sm font-medium ${isUrgent ? "text-red-600" : "text-neutral-900"}`}>
                {isUrgent ? "Yes (24-48 hours)" : "No"}
              </Text>
            </View>
          </View>
        </View>

        {/* Damage Details for Each Room */}
        {rooms.map((room: any, roomIndex: number) => (
          <View
            key={room.id || roomIndex}
            className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]"
          >
            <Text className="text-base font-semibold text-neutral-900 mb-4">
              Room {roomIndex + 1} - {room.damageLocation || "Damage Details"}
            </Text>

            <View className="gap-3">
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Damage Location:</Text>
                <Text className="text-sm text-neutral-900">{room.damageLocation || "Not specified"}</Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">Damage Type:</Text>
                <Text className="text-sm text-neutral-900">{room.damageType || "Not specified"}</Text>
              </View>

              {room.causeOfDamage && (
                <View>
                  <Text className="text-xs text-neutral-500 mb-1">Cause:</Text>
                  <Text className="text-sm text-neutral-900">{room.causeOfDamage}</Text>
                </View>
              )}

              <View>
                <Text className="text-xs text-neutral-500 mb-1">Description:</Text>
                <Text className="text-sm text-neutral-900">{room.description || "No description"}</Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">Date Noticed:</Text>
                <Text className="text-sm text-neutral-900">{room.date || "Not specified"}</Text>
              </View>

              {/* Photos */}
              {room.photos && room.photos.length > 0 && (
                <View className="mt-3">
                  <Text className="text-xs text-neutral-500 mb-2">
                    Photos ({room.photos.length}):
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {room.photos.map((photo: any, photoIndex: number) => {
                        // Handle photo URLs - could be local file URI, full URL (Azure), or relative path
                        let imageUrl = photo?.photoUrl;
                        
                        if (!imageUrl) {
                          // Skip if no photo URL
                          return null;
                        }
                        
                        // If it's already a full URL (http/https) or local file (file://), use as is
                        if (!imageUrl.startsWith('http://') && 
                            !imageUrl.startsWith('https://') && 
                            !imageUrl.startsWith('file://') &&
                            !imageUrl.startsWith('content://')) {
                          // If relative path, prepend API URL
                          const apiUrl = getApiUrl();
                          if (apiUrl) {
                            imageUrl = imageUrl.startsWith('/') 
                              ? `${apiUrl}${imageUrl}` 
                              : `${apiUrl}/${imageUrl}`;
                          }
                        }
                        
                        return (
                          <TouchableOpacity
                            key={photoIndex}
                            onPress={() => openImageViewer(imageUrl)}
                            className="relative"
                          >
                            <Image
                              source={{ uri: imageUrl }}
                              className="w-24 h-24 rounded-lg"
                              resizeMode="cover"
                              onError={(e) => {
                                console.error("Failed to load image:", imageUrl);
                              }}
                            />
                            {photo.description && (
                              <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 rounded-b-lg">
                                <Text className="text-xs text-white" numberOfLines={1}>
                                  {photo.description}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      }).filter(Boolean)}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Price Breakdown */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-base font-semibold text-neutral-900 mb-4">
            Price Breakdown
          </Text>

          <View className="gap-2">
            <View className="flex-row justify-between pb-2 border-b border-[#E2E2E2]">
              <Text className="text-sm text-neutral-500">
                Base Price ({rooms.length} {rooms.length === 1 ? "room" : "rooms"})
              </Text>
              <Text className="text-sm text-neutral-900">
                {pricing.basePrice.toFixed(2)} NOK
              </Text>
            </View>

            {pricing.discount > 0 && (
              <View className="flex-row justify-between pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">
                  Discount ({pricing.discount}%)
                </Text>
                <Text className="text-sm text-green-600">
                  -{((pricing.basePrice - pricing.discountedPrice)).toFixed(2)} NOK
                </Text>
              </View>
            )}

            {assessmentLevel === "detailed" && (
              <View className="flex-row justify-between pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">Detailed Assessment</Text>
                <Text className="text-sm text-neutral-900">200.00 NOK</Text>
              </View>
            )}

            {isUrgent && (
              <View className="flex-row justify-between pb-2 border-b border-[#E2E2E2]">
                <Text className="text-sm text-neutral-500">Urgent Fee</Text>
                <Text className="text-sm text-neutral-900">
                  {pricingConfig?.urgentFee?.toFixed(2) || "50.00"} NOK
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-base font-semibold text-neutral-900">Total</Text>
              <Text className="text-xl font-bold text-primary-600">
                {pricing.totalPrice.toFixed(2)} NOK
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-6 gap-3">
          <Button
            label="Edit Report"
            onPress={handleEdit}
            style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
            textStyle="font-bold text-neutral-700 text-base font-medium"
          />
          <Button
            label="Proceed to Payment"
            onPress={handleProceedToPayment}
            style="bg-primary-500 p-3 rounded-full w-full"
            textStyle="font-bold text-white text-base font-medium"
          />
        </View>

        {/* Image Viewer Modal */}
        {imageViewer.open && (
          <View className="absolute inset-0 bg-black/90 z-50 items-center justify-center">
            <TouchableOpacity
              onPress={closeImageViewer}
              className="absolute top-10 right-10 z-10"
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: imageViewer.imageUrl }}
              className="w-full h-3/4"
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportPreview;

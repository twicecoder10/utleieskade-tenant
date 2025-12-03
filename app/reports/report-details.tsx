import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import { useGetCaseDetailsQuery } from "@/slice/cases/index.service";
import { getApiUrl } from "@/utils/apiUrl";

const ReportDetails = () => {
  const params = useLocalSearchParams();
  const caseId = params.caseId as string;
  const [imageViewer, setImageViewer] = useState<{
    open: boolean;
    imageUrl: string;
  }>({ open: false, imageUrl: "" });

  const { data, isLoading, error } = useGetCaseDetailsQuery(caseId);

  const caseData = data?.data;

  const openImageViewer = (imageUrl: string) => {
    setImageViewer({ open: true, imageUrl });
  };

  const closeImageViewer = () => {
    setImageViewer({ open: false, imageUrl: "" });
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      open: "#10B981",
      "in-progress": "#3B82F6",
      "on-hold": "#F59E0B",
      completed: "#8B5CF6",
      cancelled: "#EF4444",
    };
    return colorMap[status] || "#6B7280";
  };

  const getUrgencyColor = (urgency: string) => {
    const colorMap: Record<string, string> = {
      high: "#EF4444",
      moderate: "#F59E0B",
      low: "#10B981",
    };
    return colorMap[urgency] || "#6B7280";
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Case Details" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2387D4" />
          <Text className="text-neutral-500 mt-4">Loading case details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !caseData) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Case Details" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="exclamationcircle" size={64} color="#EF4444" />
          <Text className="text-lg text-red-600 mt-4">Error loading case</Text>
          <Text className="text-sm text-neutral-500 mt-2">
            {error ? "Failed to load case details" : "Case not found"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const apiUrl = getApiUrl();

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Case Details" showBack />

        {/* Case Status and Urgency */}
        <View className="flex-row gap-3 mt-6">
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${getStatusColor(caseData.caseStatus)}20` }}
          >
            <Text
              className="text-xs font-semibold capitalize"
              style={{ color: getStatusColor(caseData.caseStatus) }}
            >
              {caseData.caseStatus}
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${getUrgencyColor(caseData.caseUrgencyLevel)}20` }}
          >
            <Text
              className="text-xs font-semibold capitalize"
              style={{ color: getUrgencyColor(caseData.caseUrgencyLevel) }}
            >
              {caseData.caseUrgencyLevel} Priority
            </Text>
          </View>
        </View>

        {/* Case Information */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <Text className="text-lg font-semibold text-neutral-900 mb-4">
            Case Information
          </Text>

          <View className="gap-3">
            <View>
              <Text className="text-xs text-neutral-500 mb-1">Case ID</Text>
              <Text className="text-sm text-neutral-900 font-medium">
                {caseData.caseId}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-neutral-500 mb-1">Description</Text>
              <Text className="text-sm text-neutral-900">
                {caseData.caseDescription || "No description"}
              </Text>
            </View>

            {caseData.buildingNumber && (
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Building Number</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.buildingNumber}
                </Text>
              </View>
            )}

            <View>
              <Text className="text-xs text-neutral-500 mb-1">Submitted Date</Text>
              <Text className="text-sm text-neutral-900">
                {new Date(caseData.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {caseData.caseDeadline && (
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Deadline</Text>
                <Text className="text-sm text-neutral-900">
                  {new Date(caseData.caseDeadline).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Information */}
        {caseData.property && (
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Property Information
            </Text>

            <View className="gap-3">
              <View>
                <Text className="text-xs text-neutral-500 mb-1">Address</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyAddress}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">City</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyCity}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-neutral-500 mb-1">Country</Text>
                <Text className="text-sm text-neutral-900">
                  {caseData.property.propertyCountry}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Damages */}
        {caseData.damages && caseData.damages.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Damage Details ({caseData.damages.length})
            </Text>

            {caseData.damages.map((damage: any, index: number) => (
              <View
                key={damage.damageId || index}
                className="p-4 mb-4 bg-white rounded-2xl border border-[#E2E2E2]"
              >
                <Text className="text-base font-semibold text-neutral-900 mb-3">
                  Room {index + 1} - {damage.damageLocation}
                </Text>

                <View className="gap-3">
                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Damage Type</Text>
                    <Text className="text-sm text-neutral-900">
                      {damage.damageType}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Description</Text>
                    <Text className="text-sm text-neutral-900">
                      {damage.damageDescription || "No description"}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-xs text-neutral-500 mb-1">Date Noticed</Text>
                    <Text className="text-sm text-neutral-900">
                      {new Date(damage.damageDate).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Photos */}
                  {damage.damagePhotos && damage.damagePhotos.length > 0 && (
                    <View className="mt-3">
                      <Text className="text-xs text-neutral-500 mb-2">
                        Photos ({damage.damagePhotos.length})
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                          {damage.damagePhotos.map((photo: any, photoIndex: number) => {
                            const imageUrl = photo.photoUrl.startsWith('http')
                              ? photo.photoUrl
                              : `${apiUrl}${photo.photoUrl}`;
                            
                            return (
                              <TouchableOpacity
                                key={photo.photoId || photoIndex}
                                onPress={() => openImageViewer(imageUrl)}
                                className="relative"
                              >
                                <Image
                                  source={{ uri: imageUrl }}
                                  className="w-24 h-24 rounded-lg"
                                  resizeMode="cover"
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
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Inspector Information */}
        {caseData.inspector && (
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <Text className="text-lg font-semibold text-neutral-900 mb-4">
              Assigned Inspector
            </Text>

            <View className="gap-2">
              <Text className="text-sm text-neutral-900">
                {caseData.inspector.userFirstName} {caseData.inspector.userLastName}
              </Text>
              {caseData.inspector.userEmail && (
                <Text className="text-xs text-neutral-500">
                  {caseData.inspector.userEmail}
                </Text>
              )}
            </View>
          </View>
        )}

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

export default ReportDetails;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomSelect from "@/components/ui/CustomSelect";

const ReportDamage = () => {
  const [date, setDate] = useState("06/01/2024");
  const [selectedValue, setSelectedValue] = useState<string | number>("");

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
              <Text className="mb-1 text-sm text-neutral-400">Property</Text>
              <CustomSelect
                // label="Choose an option"
                items={[{ label: "Hills Apartment", value: "Hills Apartment" }]}
                value={selectedValue}
                onValueChange={setSelectedValue}
              />
            </View>

            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">
                Building Number
              </Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="eg: building A"
                multiline={false}
                textAlignVertical="top"
              />
            </View>

            <View className="">
              <Text className="mb-1 text-sm text-neutral-400">
                Damage Location
              </Text>
              <CustomSelect
                // label="Choose an option"
                items={[
                  { label: "Kitchen", value: "Kitchen" },
                  { label: "Bathroom", value: "Bathroom" },
                  { label: "Living Room", value: "Living Room" },
                  { label: "Furniture", value: "Furniture" },
                  { label: "Exterior", value: "Exterior" },
                  { label: "Other", value: "Other" },
                ]}
                value={selectedValue}
                onValueChange={setSelectedValue}
              />
            </View>
          </View>

          {/* damage details */}
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-neutral-900">
                Damage Details (1)
              </Text>
            </View>

            {/* Damage Type */}
            <View className="mt-4">
              <Text className="text-sm text-neutral-900 mb-2">
                Type of damage
              </Text>
              <TouchableOpacity
                className="p-3 border border-[#E2E2E2] rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-gray-400">Select damage type</Text>
              </TouchableOpacity>
            </View>

            {/* Cause of Damage */}
            <View className="mt-4">
              <Text className="text-sm text-neutral-900 mb-2">
                Cause of damage
              </Text>
              <TouchableOpacity
                className="p-3 border border-[#E2E2E2] rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-gray-400">Select cause type</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View className="mt-4">
              <Text className="text-sm text-neutral-900 mb-2">Description</Text>
              <TextInput
                className="p-3 border border-[#E2E2E2] rounded-lg text-gray-400"
                placeholder="Describe the damage in detail"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Date */}
            <View className="mt-4">
              <Text className="text-sm text-neutral-900 mb-2">Date</Text>
              <View className="relative">
                <TextInput
                  value={date}
                  onChangeText={setDate}
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
              <Text className="text-sm text-neutral-900 mb-4">Photos</Text>

              {/* Overview Shots */}
              <View className="p-4 border border-[#E2E2E2] rounded-lg mb-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-neutral-900">
                    Overview shots
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-2">0 / 1</Text>
                    <TouchableOpacity
                      className="w-6 h-6 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-blue-500 text-xl">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Close-up Details */}
              <View className="p-4 border border-[#E2E2E2] rounded-lg mb-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-neutral-900">
                    Close-up Details
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-2">0 / 2</Text>
                    <TouchableOpacity
                      className="w-6 h-6 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-blue-500 text-xl">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Context Shots */}
              <View className="p-4 border border-[#E2E2E2] rounded-lg">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-neutral-900">
                    Context shots
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-2">0 / 1</Text>
                    <TouchableOpacity
                      className="w-6 h-6 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-blue-500 text-xl">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-sm text-gray-500 mt-2">
                  Show the damage in relation to the room
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDamage;

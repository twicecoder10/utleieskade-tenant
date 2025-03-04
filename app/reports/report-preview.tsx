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
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";

const ReportPreview = () => {
  const [date, setDate] = useState("06/01/2024");
  const [selectedValue, setSelectedValue] = useState<string | number>("");
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isCloseUpOpen, setIsCloseUpOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);

  const renderUploadBox = () => (
    <TouchableOpacity className="mt-4 border-dotted bg-neutral-50 border-2 border-gray-300 rounded-[14px] py-12 px-6 items-center">
      <AntDesign name="upload" size={24} color="#98A2B3" />
      <Text className="text-sm text-neutral-500 mt-3">
        Tap to upload photos (max 10 photos)
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Report Preview" showBack />

        <View className="mt-4">
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
                placeholder="Select damage location"
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
              <Text className="text-base font-semibold text-neutral-900">
                Damage Details (1)
              </Text>
            </View>

            {/* Damage Type */}
            <View className="mt-4">
              <Text className="text-sm text-neutral-900 mb-2">
                Type of damage
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
                value={selectedValue}
                onValueChange={setSelectedValue}
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
                value={selectedValue}
                onValueChange={setSelectedValue}
              />
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
              <Text className="text-base font-semibold text-neutral-900 mb-1">
                Date
              </Text>
              <Text className="text-sm text-neutral-400 mb-1">
                When did you notice this damage?
              </Text>
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
              <Text className="text-base font-semibold text-neutral-900 mb-4">
                Photos
              </Text>

              {/* Overview Shots */}
              <TouchableOpacity
                onPress={() => setIsOverviewOpen(!isOverviewOpen)}
                activeOpacity={0.7}
                className="p-4 border border-[#E2E2E2] rounded-xl mb-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-neutral-700">
                      Overview shots
                    </Text>
                    <Text className="text-sm text-gray-500 px-2 py-1 border border-[#E2E2E2] rounded-lg">
                      0 / 1
                    </Text>
                  </View>

                  <AntDesign
                    name={isOverviewOpen ? "minus" : "plus"}
                    size={16}
                    color="#475467"
                  />
                </View>

                {isOverviewOpen && renderUploadBox()}
              </TouchableOpacity>

              {/* Close-up Details */}
              <TouchableOpacity
                onPress={() => setIsCloseUpOpen(!isCloseUpOpen)}
                activeOpacity={0.7}
                className="p-4 border border-[#E2E2E2] rounded-xl mb-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-neutral-700">
                      Close-up Details
                    </Text>
                    <Text className="text-sm text-gray-500 px-2 py-1 border border-[#E2E2E2] rounded-lg">
                      0 / 2
                    </Text>
                  </View>

                  <AntDesign
                    name={isCloseUpOpen ? "minus" : "plus"}
                    size={16}
                    color="#475467"
                  />
                </View>

                {isCloseUpOpen && renderUploadBox()}
              </TouchableOpacity>

              {/* Context Shots */}
              <TouchableOpacity
                onPress={() => setIsContextOpen(!isContextOpen)}
                activeOpacity={0.7}
                className="p-4 border border-[#E2E2E2] rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-neutral-700">
                      Context shots
                    </Text>
                    <Text className="text-sm text-gray-500 px-2 py-1 border border-[#E2E2E2] rounded-lg">
                      0 / 1
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setIsContextOpen(!isContextOpen)}
                    activeOpacity={0.7}
                  >
                    <AntDesign
                      name={isContextOpen ? "minus" : "plus"}
                      size={16}
                      color="#475467"
                    />
                  </TouchableOpacity>
                </View>

                {isContextOpen && (
                  <View className="mt-2">
                    <Text className="text-sm text-neutral-500">
                      Show the damage in relation to the room:
                    </Text>
                    <View className="mt-2 ml-2">
                      <Text className="text-sm text-neutral-800">
                        • Capture from multiple angles
                      </Text>
                      <Text className="text-sm text-neutral-800">
                        • Include adjacent walls/surfaces
                      </Text>
                      <Text className="text-sm text-neutral-800">
                        • Show the scale of damage
                      </Text>
                    </View>
                    {renderUploadBox()}
                  </View>
                )}
              </TouchableOpacity>

              <Button
                label="Add another damage"
                onPress={() => console.log("Add Another damage")}
                iconImage={require("@/assets/images/add-circle.png")}
                style="bg-white p-3 w-full mt-8"
                textStyle="!font-medium text-primary-500 text-base"
                iconSize={16}
              />
            </View>
          </View>

          <Button
            label="Add Another Room"
            onPress={() => console.log("Add Another Room")}
            iconImage={require("@/assets/images/plus-sign.png")}
            style="bg-white border border-primary-500 p-3 rounded-full w-full mt-8"
            textStyle="!font-medium text-primary-500 text-base"
            iconSize={16}
          />

          {/* price breakdown */}
          <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-neutral-900">
                Price Breakdown
              </Text>
            </View>

            <View className="mt-4 flex-row items-center justify-between gap-4 pb-3.5 border-b border-[#E2E2E2]">
              <Text className="text-sm text-neutral-500">
                Base Price (1 rooms)
              </Text>
              <Text className="text-sm text-neutral-500">100 NOK</Text>
            </View>

            <View className="mt-2.5 flex-row items-center justify-between gap-4">
              <Text className="text-sm text-neutral-800 font-semibold">
                Total
              </Text>
              <Text className="text-sm text-neutral-800 font-semibold">
                100 NOK
              </Text>
            </View>
          </View>

          <View className="mt-10 gap-3">
            <Button
              label="Submit Report"
              onPress={() => console.log("Submit Report")}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-base font-medium"
            />
            <Button
              label="Save draft"
              onPress={() => console.log("Save draft")}
              style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
              textStyle="font-bold text-neutral-700 text-base font-medium"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportPreview;

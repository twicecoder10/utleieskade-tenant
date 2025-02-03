import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign, Feather } from "@expo/vector-icons";

const PrivacyPolicyScreen = () => {
  const [consents, setConsents] = useState({
    essentialCookies: true,
    thirdPartySharing: false,
  });

  const handleToggle = (key: keyof typeof consents) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  interface ConsentItemProps {
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }

  const ConsentItem = ({
    title,
    description,
    value,
    onToggle,
    disabled = false,
  }: ConsentItemProps) => (
    <View className="flex flex-row items-center justify-between py-2">
      <View className="flex-1 mr-4">
        <Text className="text-base font-medium text-neutral-800">{title}</Text>
        <Text className="text-sm text-neutral-500 mt-1">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        className="transform scale-100"
        trackColor={{ false: "#D1D5DB", true: "#E2E2E2" }}
        thumbColor={value ? "#2387D4" : "#F3F4F6"}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Privacy Policy" showBack />

        <View className="bg-white p-5 rounded-2xl border border-primary-500 mt-6">
          <View className="flex-row gap-2">
            <View className="">
              <Feather name="shield" size={20} color="#2387D4" />
            </View>
            <View>
              <Text className="text-lg font-semibold text-primary-600">
                Your privacy matters
              </Text>
              <Text className="text-primary-600 text-sm">
                Under GDPR, you have the right to access, modify, and delete
                your personal data.
              </Text>
            </View>
          </View>
        </View>

        {/* Consent Management */}
        <View className="flex flex-col gap-4 mt-6">
          <Text className="text-lg font-semibold text-neutral-700">
            Consent Management
          </Text>

          <View className="flex flex-col">
            <ConsentItem
              title="Essential Cookies"
              description="Required for basic app functionality"
              value={consents.essentialCookies}
              onToggle={() => handleToggle("essentialCookies")}
              disabled={true}
            />

            <ConsentItem
              title="Third Party Data Sharing"
              description="Share your data with our partners and payment gateways."
              value={consents.thirdPartySharing}
              onToggle={() => handleToggle("thirdPartySharing")}
            />
          </View>
        </View>

        <View className="flex flex-col gap-4 mt-6">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border border-[#E2E2E2] rounded-xl">
            <View className="flex-row items-center gap-3">
              <Text className="text-base">Your GDPR Rights</Text>
            </View>
            <AntDesign name="plus" size={16} color="#475467" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border border-[#E2E2E2] rounded-xl">
            <View className="flex-row items-center gap-3">
              <Text className="text-base">Privacy Policy</Text>
            </View>
            <AntDesign name="plus" size={16} color="#475467" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border border-[#E2E2E2] rounded-xl">
            <View className="flex-row items-center gap-3">
              <Text className="text-base">Contact DPO</Text>
            </View>
            <AntDesign name="plus" size={16} color="#475467" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

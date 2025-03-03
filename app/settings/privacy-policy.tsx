import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign, Feather } from "@expo/vector-icons";

import { legals } from "@/components/data";

import {
  useGetTenantSettingsQuery,
  useUpdateTenantSettingsMutation,
} from "@/slice/tenants/index.service";

const PrivacyPolicyScreen = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Initial consent state
  const [consents, setConsents] = useState({
    essentialCookies: true,
    thirdPartySharing: true,
  });

  const {
    data: tenantSettings,
    isLoading,
    refetch,
  } = useGetTenantSettingsQuery({});

  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateTenantSettingsMutation();

  console.log("tenantSettings:", tenantSettings);

  useEffect(() => {
    // Backend returns privacySecurity, but we need to adapt to that structure
    if (tenantSettings?.privacySecurity) {
      setConsents({
        essentialCookies:
          tenantSettings.privacySecurity.essentialCookies ?? true,
        thirdPartySharing:
          tenantSettings.privacySecurity.thirdPartySharing ?? false,
      });
    }
  }, [tenantSettings]);

  const handleToggle = async (key: keyof typeof consents) => {
    const newConsents = {
      ...consents,
      [key]: !consents[key],
    };

    setConsents(newConsents);

    try {
      console.log("Updating settings with:", {
        privacyPolicy: {
          essentialCookies: newConsents.essentialCookies,
          thirdPartySharing: newConsents.thirdPartySharing,
        },
      });

      // Send the request to update settings
      await updateSettings({
        privacyPolicy: {
          essentialCookies: newConsents.essentialCookies,
          thirdPartySharing: newConsents.thirdPartySharing,
        },
      }).unwrap();

      // Refetch the settings
      refetch();
    } catch (error) {
      // Revert to the previous state if the update fails
      setConsents(consents);
      console.error("Failed to update privacy settings:", error);
      Alert.alert(
        "Error",
        "Failed to update privacy settings. Please try again."
      );
    }
  };

  interface ConsentItemProps {
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  }

  const ConsentItem = ({
    title,
    description,
    value,
    onToggle,
    disabled = false,
    isLoading = false,
  }: ConsentItemProps) => (
    <View className="flex flex-row items-center justify-between py-2">
      <View className="flex-1 mr-4">
        <Text className="text-base font-medium text-neutral-800">{title}</Text>
        <Text className="text-sm text-neutral-500 mt-1">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled || isLoading}
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
              isLoading={isLoading || isUpdating}
            />

            <ConsentItem
              title="Third Party Data Sharing"
              description="Share your data with our partners and payment gateways."
              value={consents.thirdPartySharing}
              onToggle={() => handleToggle("thirdPartySharing")}
              isLoading={isLoading || isUpdating}
            />
          </View>
        </View>

        <View className="flex flex-col gap-4 mt-6">
          {legals.map((legal, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setOpenIndex(openIndex === index ? null : index)}
              className="p-4 border border-[#E2E2E2] rounded-xl"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-neutral-900 flex-1 pr-4">
                  {legal.label}
                </Text>
                <AntDesign
                  name={openIndex === index ? "minus" : "plus"}
                  size={16}
                  color="#475467"
                />
              </View>

              {openIndex === index && (
                <Text className="mt-2 text-sm text-neutral-500">
                  {legal.content}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

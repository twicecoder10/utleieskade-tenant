import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface SelectProps {
  label?: string;
  items: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Select an option...",
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-lg font-semibold mb-2 text-gray-800">
          {label}
        </Text>
      )}

      <View className="border border-gray-300 rounded-lg bg-white flex-row items-center px-4 w-full">
        <View className="flex-1">
          <RNPickerSelect
            onValueChange={onValueChange}
            items={items}
            value={value}
            style={{
              inputIOS: {
                paddingVertical: 12,
                color: "#111827",
                width: "100%",
              },
              inputAndroid: {
                paddingVertical: 12,
                color: "#111827",
                width: "100%",
              },
              placeholder: {
                color: "#6B7280",
              },
            }}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: placeholder, value: null }}
          />
        </View>
        <Ionicons name="chevron-down" size={16} color="#D0D5DD" />
      </View>
    </View>
  );
};

export default CustomSelect;

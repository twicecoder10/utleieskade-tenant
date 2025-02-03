import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface DraftItemProps {
  title: string;
  location: string;
  hasUploads?: boolean;
  isEmergency?: boolean;
}

export const DraftItem = ({
  title,
  location,
  hasUploads = false,
  isEmergency = false,
}: DraftItemProps) => (
  <TouchableOpacity className="flex-row items-center justify-between py-4">
    <View className="flex-row items-center flex-1">
      <Image
        source={{
          uri: "https://thesinkboutique.com/cdn/shop/products/wj4kcp1ofbnpkslovd8h.jpg?v=1638983173",
        }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-neutral-900">{title}</Text>
        <Text className="text-sm text-neutral-500">{location}</Text>
        <Text className="text-sm text-neutral-500">
          {hasUploads ? "Has uploads" : "No uploads"}
        </Text>
        {isEmergency && (
          <View className="flex-row items-center mt-1">
            <AntDesign name="warning" size={12} color="#B91C1C" />
            <Text className="text-error-700 text-sm ml-1">Emergency</Text>
          </View>
        )}
      </View>
    </View>
    <Text className="text-blue-500">Resume editing</Text>
  </TouchableOpacity>
);

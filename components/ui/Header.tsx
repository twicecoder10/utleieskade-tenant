import { View, Text, TouchableOpacity, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
}) => {
  return (
    <View className="w-full pt-5 pb-3 bg-white">
      <View className="flex-row items-center gap-4">
        {showBack && (
          <TouchableOpacity onPress={onBackPress || (() => router.back())}>
            <EvilIcons name="chevron-left" size={36} color="#98A2B3" />
          </TouchableOpacity>
        )}
        <Text className="text-2xl text-neutral-900 font-semibold">{title}</Text>
      </View>
    </View>
  );
};

export default Header;

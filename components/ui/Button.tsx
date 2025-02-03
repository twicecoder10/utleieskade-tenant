import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

interface PressableButtonProps {
  label: string;
  onPress: () => void;
  iconImage?: any;
  iconSize?: number;
  style?: string;
  textStyle?: string;
  disabled?: boolean;
}

const Button: React.FC<PressableButtonProps> = ({
  label,
  onPress,
  iconImage,
  iconSize = 24,
  style = "",
  textStyle = "text-white",
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-center ${style}`}
      disabled={disabled}
    >
      {iconImage && (
        <Image
          source={iconImage}
          style={{ width: iconSize, height: iconSize, marginRight: 8 }}
          resizeMode="contain"
        />
      )}
      <Text className={`text-center font-medium ${textStyle}`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;

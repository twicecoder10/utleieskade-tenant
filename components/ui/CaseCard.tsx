import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Status = "open" | "in-progress" | "completed";
type Priority = "high" | "moderate" | "low";

export const CaseCard = ({
  status,
  location,
  reportTime,
  photoCount,
  priority,
  isRecent,
  caseTitle,
  propertyAddress,
  firstPhotoUrl,
  onPress,
}: {
  status: string;
  location: string;
  reportTime: number;
  photoCount: number;
  priority: string;
  isRecent: boolean;
  caseTitle: string;
  propertyAddress: string;
  firstPhotoUrl?: string | null;
  onPress?: () => void;
}) => {
  const statusStyles: Record<
    Status,
    { backgroundColor: string; color: string }
  > = {
    open: { backgroundColor: "#FFFBEB", color: "#F59E0B" },
    "in-progress": { backgroundColor: "#F1F7FE", color: "#2387D4" },
    completed: { backgroundColor: "#F0FDF4", color: "#15803D" },
  };

  const priorityColors: Record<Priority, string> = {
    high: "#DC2626",
    moderate: "#EA580C",
    low: "#16A34A",
  };

  // Normalize the status and priority to match our types
  // Add safety checks for undefined/null values
  const statusStr = status?.toString().toLowerCase() || "open";
  const priorityStr = priority?.toString().toLowerCase() || "moderate";
  
  const normalizedStatus = (
    statusStr === "in progress"
      ? "in-progress"
      : statusStr
  ) as Status;

  const normalizedPriority = priorityStr as Priority;

  // Use the defined styles, with default styles
  const statusStyle = statusStyles[normalizedStatus] || {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
  };
  const priorityColor = priorityColors[normalizedPriority] || "#6B7280";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white p-4 border-b border-gray-200"
    >
      <View className="flex flex-row items-start gap-3">
        {firstPhotoUrl ? (
          <Image
            source={{ 
              uri: firstPhotoUrl.startsWith('http://') || firstPhotoUrl.startsWith('https://') 
                ? firstPhotoUrl 
                : `${process.env.EXPO_PUBLIC_API_URL || 'https://utleieskade-api2-production-2915.up.railway.app'}${firstPhotoUrl.startsWith('/') ? '' : '/'}${firstPhotoUrl}`
            }}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
            onError={(error) => {
              console.error("Image load error:", error);
            }}
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <AntDesign name="picture" size={20} color="#9CA3AF" />
          </View>
        )}
        <View className="flex-1">
          <View className="flex flex-row justify-between items-start">
            <Text className="text-base font-medium text-gray-900">
              {caseTitle || "Untitled Case"}
            </Text>
            <View
              style={{
                backgroundColor: statusStyle.backgroundColor,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
              className="rounded-full"
            >
              <Text
                style={{ color: statusStyle.color }}
                className="text-sm font-medium capitalize"
              >
                {normalizedStatus}
              </Text>
            </View>
          </View>

          <Text className="text-sm text-gray-500 mt-1">
            {propertyAddress || "No address provided"}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Damage at: {location}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Reported {reportTime} {reportTime === 1 ? "day" : "days"} ago
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {photoCount} {photoCount === 1 ? "photo" : "photos"}
          </Text>

          <View className="mt-2">
            <View className="flex-row items-center gap-1">
              <AntDesign name="warning" size={12} color={priorityColor} />
              <Text
                style={{ color: priorityColor }}
                className="text-sm font-medium"
              >
                {normalizedPriority}
              </Text>
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                if (onPress) {
                  onPress();
                } else if (isRecent) {
                  router.push("/reports/report-details");
                } else {
                  console.log("Downloaded Report Receipt");
                }
              }}
              className="mt-2"
            >
              <Text className="text-sm font-medium text-primary-500">
                {isRecent ? "View report details" : "Download report receipt"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};


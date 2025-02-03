import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Status = "pending" | "in progress" | "completed";
type Priority = "emergency" | "moderate" | "minor";

export const CaseCard = ({
  status,
  location,
  reportTime,
  photoCount,
  priority,
  isRecent,
}: {
  status: string;
  location: string;
  reportTime: string | number;
  photoCount: number;
  priority: string;
  isRecent: boolean;
}) => {
  const statusStyles: Record<
    Status,
    { backgroundColor: string; color: string }
  > = {
    pending: { backgroundColor: "#FFFBEB", color: "#F59E0B" },
    "in progress": { backgroundColor: "#F1F7FE", color: "#2387D4" },
    completed: { backgroundColor: "#F0FDF4", color: "#15803D" },
  };

  const priorityColors: Record<Priority, string> = {
    emergency: "#DC2626",
    moderate: "#EA580C",
    minor: "#16A34A",
  };

  // Convert the status and priority to lowercase
  const normalizedStatus = status.toLowerCase() as Status;
  const normalizedPriority = priority.toLowerCase() as Priority;

  // Use the defined styles, with default styles
  const statusStyle = statusStyles[normalizedStatus] || {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
  };
  const priorityColor = priorityColors[normalizedPriority] || "#6B7280";

  return (
    <View className="bg-white p-4 border-b border-gray-200">
      <View className="flex flex-row items-start gap-3">
        <Image
          source={{
            uri: "https://thesinkboutique.com/cdn/shop/products/wj4kcp1ofbnpkslovd8h.jpg?v=1638983173",
          }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1">
          <View className="flex flex-row justify-between items-start">
            <Text className="text-base font-medium text-gray-900">
              Kitchen Sink Leak
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
                className="text-sm font-medium"
              >
                {status}
              </Text>
            </View>
          </View>

          <Text className="text-sm text-gray-500 mt-1">{location}</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Reported {reportTime} days ago
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {photoCount} Photos
          </Text>

          <View className="mt-2">
            <View className="flex-row items-center gap-1">
              <AntDesign name="warning" size={12} color={priorityColor} />
              <Text
                style={{ color: priorityColor }}
                className="text-sm font-medium"
              >
                {priority}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                isRecent
                  ? router.push("/reports/report-details")
                  : console.log("Downloaded Report Receipt")
              }
              className="mt-2"
            >
              <Text className="text-sm font-medium text-primary-500">
                {isRecent ? "View report details" : "Download report receipt"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

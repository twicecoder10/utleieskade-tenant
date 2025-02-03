import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        {/* Location */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={18} color="#667085" />
            <Text className="ml-1 text-sm text-gray-500">Oslo, Norway</Text>
            <Ionicons name="chevron-down-outline" size={16} color="#667085" />
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#667085" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row gap-3 items-center">
          <View className="relative flex-1">
            <TextInput
              placeholder="Search"
              className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-500 font-medium pl-10"
            />
            <Ionicons
              name="search-outline"
              size={20}
              color="#98A2B3"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </View>

          <TouchableOpacity className="bg-primary-500 p-3 rounded-lg">
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-800">
            Welcome back, Salif 👋
          </Text>
          <Text className="text-sm text-gray-500">
            Manage your property issues effortlessly
          </Text>
        </View>

        {/* Report Damages Card */}
        <TouchableOpacity className="flex-row items-center p-4 mt-4 bg-gray-100 rounded-xl">
          <View className="flex-1">
            <Text className="text-sm font-medium text-blue-600">
              Report damages
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Let us know about any damage that needs attention.
            </Text>
          </View>
          <Image
            source={require("@/assets/images/report-damages.png")}
            className="size-[80px]"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Active Cases Card */}
        <View className="p-4 mt-4 bg-gray-100 rounded-xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-800">
              Active Cases
            </Text>
            <Ionicons name="alert-circle-outline" size={20} color="#FF6B6B" />
          </View>
          <Text className="mt-2 text-2xl font-bold text-gray-800">12</Text>
          <Text className="mt-1 text-sm text-gray-500">
            4 requires attention
          </Text>
        </View>

        {/* Resolved Issues Card */}
        <View className="p-4 mt-4 bg-gray-100 rounded-xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-800">
              Resolved Issues
            </Text>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#4CAF50"
            />
          </View>
          <Text className="mt-2 text-2xl font-bold text-gray-800">20</Text>
          <Text className="mt-1 text-sm text-gray-500">Last 30 days</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { StyleSheet, Image, Platform, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportScreen() {
  return (
    <SafeAreaView className="flex-1 px-4 py-2 pb-8 bg-white">
      <Text className="text-3xl font-bold">Report and Track</Text>
    </SafeAreaView>
  );
}


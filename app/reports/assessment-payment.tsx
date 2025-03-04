import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";

const AssessmentPayment = () => {
  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Assessment Payment" showBack />

        <View className="mt-6"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssessmentPayment;

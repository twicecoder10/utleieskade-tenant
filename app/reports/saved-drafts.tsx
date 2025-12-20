import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  getAllDrafts,
  deleteDraft,
  DraftCase,
} from "@/utils/draftStorage";

const SavedDrafts = () => {
  const [drafts, setDrafts] = useState<DraftCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      setIsLoading(true);
      const allDrafts = await getAllDrafts();
      setDrafts(allDrafts);
    } catch (error) {
      console.error("Error loading drafts:", error);
      Alert.alert("Error", "Failed to load drafts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    Alert.alert(
      "Delete Draft",
      "Are you sure you want to delete this draft?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDraft(draftId);
              await loadDrafts();
              Alert.alert("Success", "Draft deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete draft");
            }
          },
        },
      ]
    );
  };

  const handleEditDraft = (draft: DraftCase) => {
    // Navigate to report-damage with draft data
    router.push({
      pathname: "/reports/report-damage",
      params: {
        draftId: draft.id,
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Saved Drafts" showBack />
        <View className="flex-1 items-center justify-center">
          <Text className="text-neutral-500">Loading drafts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (drafts.length === 0) {
    return (
      <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
        <Header title="Saved Drafts" showBack />
        <View className="flex-1 items-center justify-center">
          <AntDesign name="file-text" size={64} color="#D1D5DB" />
          <Text className="text-lg text-neutral-500 mt-4">
            No saved drafts
          </Text>
          <Text className="text-sm text-neutral-400 mt-2 text-center">
            Your saved case drafts will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Saved Drafts" showBack />

        <View className="mt-6 gap-4">
          {drafts.map((draft) => (
            <View
              key={draft.id}
              className="p-4 bg-white rounded-2xl border border-[#E2E2E2]"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-neutral-900">
                    {draft.propertyAddress || "Untitled Case"}
                  </Text>
                  <Text className="text-sm text-neutral-500 mt-1">
                    {draft.buildingNumber && `Building: ${draft.buildingNumber}`}
                  </Text>
                  <Text className="text-xs text-neutral-400 mt-1">
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEditDraft(draft)}
                    className="p-2"
                  >
                    <AntDesign name="edit" size={20} color="#2387D4" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDraft(draft.id)}
                    className="p-2"
                  >
                    <AntDesign name="delete" size={20} color="#B91C1C" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                  <AntDesign name="home" size={14} color="#667085" />
                  <Text className="text-xs text-neutral-500">
                    {draft.damages.length} {draft.damages.length === 1 ? "room" : "rooms"}
                  </Text>
                </View>
                {draft.isUrgent && (
                  <View className="flex-row items-center gap-1">
                    <AntDesign name="exclamation-circle" size={14} color="#B91C1C" />
                    <Text className="text-xs text-red-600">Urgent</Text>
                  </View>
                )}
                <View className="flex-row items-center gap-1">
                  <AntDesign name="camera" size={14} color="#667085" />
                  <Text className="text-xs text-neutral-500">
                    {draft.damages.reduce((sum, d) => sum + d.photos.length, 0)} photos
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedDrafts;

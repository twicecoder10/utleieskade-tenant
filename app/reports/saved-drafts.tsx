import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";
import { DraftItem } from "@/components/ui/DraftItem";
import Header from "@/components/ui/Header";
import { drafts } from "@/components/data";

const SavedDrafts = () => {
  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Saved drafts" showBack />

        <View className="">
          {drafts.map((draft, index) => (
            <View
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <DraftItem {...draft} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedDrafts;

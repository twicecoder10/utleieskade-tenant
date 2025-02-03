import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { CaseCard } from "@/components/ui/CaseCard";
import { cases } from "@/components/data";

const AllReportCases = () => {
  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="All Cases" showBack />

        <View className="mt-6">
          <View className="flex flex-col gap-4">
            {cases.map((caseItem, index) => (
              <CaseCard key={index} {...caseItem} isRecent={true} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllReportCases;

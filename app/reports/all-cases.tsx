import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { CaseCard } from "@/components/ui/CaseCard";
import { useGetTenantCasesQuery } from "@/slice/tenants/index.service";

const AllReportCases = () => {
  const {
    data: tenantCases,
    isLoading: tenantCasesLoading,
    error: tenantCasesError,
  } = useGetTenantCasesQuery({});

  const cases = tenantCases?.cases || [];

  // console.log("Tenant Cases:", tenantCases);

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header title="All Cases" showBack />

        <View className="mt-6">
          {tenantCasesLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : tenantCasesError ? (
            <Text className="text-red-500 text-center">
              Failed to load cases
            </Text>
          ) : cases.length > 0 ? (
            <View className="flex flex-col gap-4">
              {cases.map((caseItem, index) => (
                <CaseCard key={index} {...caseItem} isRecent={true} />
              ))}
            </View>
          ) : (
            <Text className="text-neutral-500 text-center">
              No cases available
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllReportCases;

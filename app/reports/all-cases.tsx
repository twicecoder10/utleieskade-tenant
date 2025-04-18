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

  const cases = tenantCases?.data?.cases || [];

  console.log("Tenant Cases:", JSON.stringify(tenantCases, null, 2));

  const formatReportTime = (dateString: string) => {
    const reportedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - reportedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              {cases.map((caseItem: any, index: number) => (
                <CaseCard
                  key={index}
                  status={caseItem.status}
                  location={
                    caseItem.damages[0]?.damageLocation || "Unknown location"
                  }
                  reportTime={formatReportTime(caseItem.reportedDate)}
                  photoCount={caseItem.damages[0]?.numPhotos || 0}
                  priority={caseItem.urgency}
                  isRecent={true}
                  caseTitle={caseItem.caseTitle}
                  propertyAddress={caseItem.property?.propertyAddress}
                />
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

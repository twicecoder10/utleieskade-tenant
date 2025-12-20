import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { CaseCard } from "@/components/ui/CaseCard";
import { useGetTenantCasesQuery } from "@/slice/tenants/index.service";
import { router } from "expo-router";
import { useAppSelector } from "@/store/store";

const AllReportCases = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  
  const {
    data: tenantCases,
    isLoading: tenantCasesLoading,
    error: tenantCasesError,
  } = useGetTenantCasesQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });

  // Handle different response structures
  const cases = tenantCases?.data?.cases || tenantCases?.cases || [];

  // Debug logging
  if (tenantCases) {
    console.log("Tenant Cases Response:", JSON.stringify(tenantCases, null, 2));
    console.log("Extracted Cases:", cases.length);
  }

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
            <View className="p-4">
              <Text className="text-red-500 text-center mb-2">
                Failed to load cases
              </Text>
              <Text className="text-xs text-gray-500 text-center">
                {JSON.stringify(tenantCasesError)}
              </Text>
            </View>
          ) : cases.length > 0 ? (
            <View className="flex flex-col gap-4">
              {cases.map((caseItem: any, index: number) => {
                // Get first photo URL from various possible locations
                const firstPhotoUrl = 
                  caseItem.firstPhotoUrl ||
                  caseItem.damages?.[0]?.damagePhotos?.[0]?.photoUrl ||
                  caseItem.damages?.find((d: any) => d.damagePhotos?.[0]?.photoUrl)?.damagePhotos?.[0]?.photoUrl ||
                  null;
                
                return (
                  <CaseCard
                    key={index}
                    status={caseItem.status}
                    location={
                      caseItem.damages?.[0]?.damageLocation || caseItem.caseTitle || "Unknown location"
                    }
                    reportTime={formatReportTime(caseItem.reportedDate || caseItem.createdAt)}
                    photoCount={caseItem.numPhotos || caseItem.damages?.[0]?.numPhotos || caseItem.damages?.reduce((sum: number, d: any) => sum + (d.damagePhotos?.length || 0), 0) || 0}
                    priority={caseItem.urgency || caseItem.urgencyLevel}
                    isRecent={true}
                    caseTitle={caseItem.caseTitle || caseItem.caseDescription}
                    propertyAddress={caseItem.property?.propertyAddress}
                    firstPhotoUrl={firstPhotoUrl}
                    onPress={() => router.push({
                      pathname: "/reports/report-details",
                      params: { caseId: caseItem.caseId || caseItem.caseID || caseItem.id }
                    })}
                  />
                );
              })}
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

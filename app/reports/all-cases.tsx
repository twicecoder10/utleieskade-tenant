import React from "react";
import { View, ScrollView, Text, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { CaseCard } from "@/components/ui/CaseCard";
import { useGetTenantCasesQuery } from "@/slice/tenants/index.service";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useAppSelector } from "@/store/store";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const AllReportCases = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.search as string || "");
  
  const {
    data: tenantCases,
    isLoading: tenantCasesLoading,
    error: tenantCasesError,
    refetch: refetchCases,
  } = useGetTenantCasesQuery({
    search: searchQuery || undefined,
  }, {
    skip: !isLoggedIn, // Skip query if not logged in
    refetchOnMountOrArgChange: true,
  });

  // Handle different response structures
  const cases = tenantCases?.data?.cases || tenantCases?.cases || tenantCases?.data || [];

  // Refetch cases when screen comes into focus to get latest status updates
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        refetchCases();
      }
    }, [isLoggedIn, refetchCases])
  );

  // Update search query when params change
  useEffect(() => {
    if (params.search) {
      setSearchQuery(params.search as string);
    }
  }, [params.search]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn && searchQuery) {
        refetchCases();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

        {/* Search Bar */}
        <View className="mt-4 relative">
          <TextInput
            placeholder="Search by case details, description, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-500 font-medium pl-10"
          />
          <Ionicons
            name="search-outline"
            size={20}
            color="#98A2B3"
            style={{ position: "absolute", left: 12, top: 12 }}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={{ position: "absolute", right: 12, top: 12 }}
            >
              <Ionicons name="close-circle" size={20} color="#98A2B3" />
            </TouchableOpacity>
          ) : null}
        </View>

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
                const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
                let firstPhotoUrl = 
                  caseItem.firstPhotoUrl ||
                  caseItem.damages?.[0]?.damagePhotos?.[0]?.photoUrl ||
                  caseItem.damages?.find((d: any) => d.damagePhotos?.[0]?.photoUrl)?.damagePhotos?.[0]?.photoUrl ||
                  null;
                
                // Ensure photo URL is a full URL
                if (firstPhotoUrl && !firstPhotoUrl.startsWith('http')) {
                  firstPhotoUrl = `${apiUrl}${firstPhotoUrl.startsWith('/') ? '' : '/'}${firstPhotoUrl}`;
                }
                
                // Normalize case status - handle "in progress" -> "in-progress"
                const rawStatus = caseItem.status || caseItem.caseStatus || "open";
                let normalizedStatus = rawStatus.toLowerCase();
                if (normalizedStatus === "in progress") {
                  normalizedStatus = "in-progress";
                } else {
                  normalizedStatus = normalizedStatus.replace(/\s+/g, '-');
                }
                
                return (
                  <CaseCard
                    key={index}
                    status={normalizedStatus}
                    location={
                      caseItem.damages?.[0]?.damageLocation || caseItem.caseTitle || "Unknown location"
                    }
                    reportTime={formatReportTime(caseItem.reportedDate || caseItem.createdAt)}
                    photoCount={caseItem.numPhotos || caseItem.damages?.[0]?.numPhotos || caseItem.damages?.reduce((sum: number, d: any) => sum + (d.damagePhotos?.length || 0), 0) || 0}
                    priority={caseItem.urgency || caseItem.urgencyLevel || "moderate"}
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
            <View className="items-center justify-center py-8">
              <Ionicons name="document-outline" size={64} color="#D1D5DB" />
              <Text className="text-neutral-500 text-center mt-4">
                {searchQuery ? "No cases found matching your search" : "No cases available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllReportCases;

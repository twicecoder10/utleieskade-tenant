import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import React, { useState, useEffect } from "react";
import { cases, faqs } from "@/components/data";
import { useGetUserQuery } from "@/slice/auth/index.service";
import {
  useGetDashboardDataQuery,
  useGetTenantCasesQuery,
  useGetUnreadNotificationCountQuery,
} from "@/slice/tenants/index.service";
import { router, useFocusEffect } from "expo-router";
import { useAppSelector } from "@/store/store";
import { t } from "@/utils/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const [language, setLanguage] = useState<"Norwegian" | "English">("Norwegian");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("@app_language");
        if (savedLanguage === "Norwegian" || savedLanguage === "English") {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDashboardDataQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });

  const {
    data: tenantCases,
    isLoading: tenantCasesLoading,
    error: tenantCasesError,
    refetch: refetchCases,
  } = useGetTenantCasesQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
  });

  const { data: unreadCountData } = useGetUnreadNotificationCountQuery({}, {
    skip: !isLoggedIn,
    pollingInterval: 30000, // Poll every 30 seconds for new notifications
  });
  
  const unreadCount = unreadCountData?.data?.count || unreadCountData?.count || 0;

  // Refetch dashboard and cases when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        refetchDashboard();
        refetchCases();
      }
    }, [isLoggedIn, refetchDashboard, refetchCases])
  );

  // Handle different response structures
  const dashboard = dashboardData?.data || dashboardData || {};
  const user = userData?.data || userData || {};
  
  // Only use dashboard data if it's loaded and not in error state
  const activeCases = dashboardLoading ? 0 : (dashboard?.activeCases?.count || 0);
  const requiresAttention = dashboardLoading ? 0 : (dashboard?.activeCases?.requiresAttention || 0);
  const resolvedIssues = dashboardLoading ? 0 : (dashboard?.resolvedIssues?.count || 0);
  const scheduledInspections = dashboardLoading ? 0 : (dashboard?.scheduledInspections || 0);
  const nextInspection = dashboardLoading ? "Loading..." : (dashboard?.nextInspection || "No upcoming inspections");
  // Handle different response structures - cases can be in data.cases or directly in data
  const tenants = tenantCases?.data?.cases || tenantCases?.cases || tenantCases?.data || [];

  // console.log("Dashboard Data:", dashboard);
  // console.log("Tenant Cases:", tenants);

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        {/* Display Error Messages */}
        {userError && (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-sm">
              Error fetching user data
            </Text>
          </View>
        )}
        {dashboardError && (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-sm">
              Error fetching dashboard data
            </Text>
            {(dashboardError?.data?.message || dashboardError?.error) && (
              <Text className="text-red-600 text-xs mt-1">
                {dashboardError?.data?.message || dashboardError?.error}
              </Text>
            )}
          </View>
        )}
        {tenantCasesError && (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-sm">
              Error fetching tenant cases: {JSON.stringify(tenantCasesError)}
            </Text>
          </View>
        )}

        {/* Location */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={18} color="#667085" />
            <TouchableOpacity className="flex-row items-center">
              <Text className="ml-1 text-sm text-gray-500">Oslo, Norway</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#667085" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Navigate to notifications screen when implemented
              Alert.alert("Notifications", "Notification screen coming soon");
            }}
            className="relative"
          >
            <Ionicons name="notifications-outline" size={24} color="#667085" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row gap-3 items-center">
          <View className="relative flex-1">
            <TextInput
              placeholder="Search cases..."
              className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-500 font-medium pl-10"
              onChangeText={(text) => {
                // Search will be handled by navigating to all-cases with search param
                if (text.trim()) {
                  router.push({
                    pathname: "/reports/all-cases",
                    params: { search: text.trim() }
                  });
                }
              }}
            />
            <Ionicons
              name="search-outline"
              size={20}
              color="#98A2B3"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </View>
        </View>

        {/* Welcome Section */}
        <View className="mt-6">
          <Text className="text-2xl font-semibold text-neutral-900">
            {t("Welcome back", language)}, {user?.userFirstName || ""} 👋
          </Text>
          <Text className="text-sm text-neutral-500">
            {t("Manage your property issues effortlessly", language)}
          </Text>
        </View>

        {/* Report Damages Card */}
        <TouchableOpacity className="flex-row items-center p-4 mt-4 bg-gray-100 rounded-xl">
          <View className="flex-1">
            <Text className="text-base font-semibold text-primary-700">
              {t("Report damages", language)}
            </Text>
            <Text className="mt-1 text-sm text-neutral-500">
              {t("Let us know about any damage that needs attention.", language)}
            </Text>
          </View>
          <Image
            source={require("@/assets/images/report-damages.png")}
            className="size-[80px]"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Active Cases Card */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-neutral-900">
              {t("Active Cases", language)}
            </Text>
            <AntDesign name="warning" size={24} color="#B91C1C" />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {dashboardLoading ? "..." : activeCases}
          </Text>

          <Text className="mt-1 text-sm text-neutral-500">
            {dashboardLoading ? t("Loading...", language) : `${requiresAttention} ${t("requires attention", language)}`}
          </Text>
        </View>

        {/* Resolved Issues Card */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-neutral-900">
              {t("Resolved Issues", language)}
            </Text>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#15803D"
            />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {dashboardLoading ? "..." : resolvedIssues}
          </Text>

          <Text className="mt-1 text-sm text-neutral-500">{t("Last 30 days", language)}</Text>
        </View>

        {/* Scheduled Inspections Card */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-neutral-900">
              {t("Scheduled Inspections", language)}
            </Text>
            <AntDesign name="calendar" size={24} color="#2387D4" />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {dashboardLoading ? "..." : scheduledInspections}
          </Text>
          <View className="flex-row gap-1 items-center mt-1">
            <Text className="text-sm text-primary-500">{t("Next:", language)}</Text>
            <Text className="text-sm text-neutral-500">
              {nextInspection}
            </Text>
          </View>
        </View>

        {/* Quick Action */}
        <View className="flex flex-col gap-4 mt-6">
          <Text className="text-lg font-semibold text-neutral-900">
            Quick Action
          </Text>

          <View className="px-6 flex flex-col gap-2">
            <Button
              label={t("Report New Case", language)}
              onPress={() => router.push("/reports/report-damage")}
              iconImage={require("@/assets/images/camera-icon.png")}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-base font-medium"
            />
            <Button
              label={t("View All Cases", language)}
              onPress={() => router.push("/reports/all-cases")}
              iconImage={require("@/assets/images/document-icon.png")}
              style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
              textStyle="font-bold text-neutral-700 text-base font-medium"
            />
            <Button
              label={t("Download Receipts", language)}
              onPress={() => router.push("/reports/receipts")}
              iconImage={require("@/assets/images/document-icon.png")}
              style="bg-white border border-[#E2E2E2] p-3 rounded-full w-full"
              textStyle="font-bold text-neutral-700 text-base font-medium"
            />
          </View>
        </View>

        {/* Submitted Cases */}
        <View className="flex flex-col gap-4 mt-6">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-neutral-900">
              Submitted Cases
            </Text>
            <TouchableOpacity onPress={() => router.push("/reports/all-cases")}>
              <Text className="text-sm text-blue-500">View all</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-col gap-4">
            {tenantCasesLoading ? (
              <Text className="text-sm text-gray-500">Loading reports...</Text>
            ) : tenantCasesError ? (
              <Text className="text-sm text-red-500">
                Error fetching reports
              </Text>
            ) : tenants?.length > 0 ? (
              tenants.map((caseItem: any, index: number) => {
                // Get first photo URL from various possible locations
                const firstPhotoUrl = 
                  caseItem.firstPhotoUrl ||
                  caseItem.damages?.[0]?.damagePhotos?.[0]?.photoUrl ||
                  caseItem.damages?.find((d: any) => d.damagePhotos?.[0]?.photoUrl)?.damagePhotos?.[0]?.photoUrl ||
                  null;
                
                return (
                  <CaseCard
                    key={caseItem.caseId || caseItem.caseID || index}
                    status={caseItem.status || caseItem.caseStatus || "open"}
                    location={caseItem.damages?.[0]?.damageLocation || caseItem.location || "Unknown location"}
                    reportTime={caseItem.reportTime || 0}
                    photoCount={caseItem.numPhotos || caseItem.photoCount || 0}
                    priority={caseItem.priority || caseItem.urgency || caseItem.urgencyLevel || "moderate"}
                    isRecent={false}
                    caseTitle={caseItem.caseTitle || caseItem.caseDescription || "Untitled Case"}
                    propertyAddress={caseItem.property?.propertyAddress || caseItem.propertyAddress || ""}
                    firstPhotoUrl={firstPhotoUrl}
                    onPress={() => {
                      const caseId = caseItem.caseId || caseItem.caseID;
                      if (caseId) {
                        router.push({
                          pathname: "/reports/report-details",
                          params: { caseId }
                        });
                      }
                    }}
                  />
                );
              })
            ) : (
              <Text className="text-base text-neutral-500 text-center">
                No submitted reports found
              </Text>
            )}
          </View>
        </View>

        {/* FAQs */}
        <View className="bg-white p-5 rounded-2xl border border-[#E2E2E2] mt-6">
          <View className="mb-6">
            <Text className="text-xl font-semibold text-neutral-900">
              Frequently asked questions
            </Text>
            <Text className="text-sm text-neutral-500 mt-1">
              Everything you need to know about the product and billing.
            </Text>
          </View>

          {/* FAQ Items */}
          <View className="space-y-4">
            {faqs.map((faq, index) => (
              <View
                key={index}
                className={`pb-4 ${
                  index !== faqs.length - 1
                    ? "border-b border-gray-100 mb-3"
                    : ""
                }`}
              >
                <TouchableOpacity
                  onPress={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-base font-medium text-neutral-900 flex-1 pr-4">
                    {faq.question}
                  </Text>
                  <AntDesign
                    name={openIndex === index ? "minus" : "plus"}
                    size={24}
                    color="#156AB4"
                  />
                </TouchableOpacity>

                {openIndex === index && (
                  <Text className="mt-2 text-sm text-neutral-500">
                    {faq.answer}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Contact Section */}
          <View className="mt-6 items-center bg-gray-50 rounded-xl py-6 px-5">
            <View className="flex-col gap-2 items-center justify-center">
              <Text className="text-lg font-medium text-neutral-900 text-center">
                Still have questions?
              </Text>
              <Text className="text-sm text-neutral-500 text-center max-w-[270px] mx-auto">
                Can't find the answer you're looking for? Please contact us.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Open email client
                  const email = "support@utleieskade.no"; // Replace with actual support email
                  // For React Native, you can use Linking to open email
                  // Linking.openURL(`mailto:${email}`);
                  Alert.alert("Support", `Please contact us at: ${email}`);
                }}
                className="mt-4 items-center bg-primary-500 p-3 px-6 rounded-full"
              >
                <Text className="text-white font-medium">Send us a mail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

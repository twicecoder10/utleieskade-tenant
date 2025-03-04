import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import { useState } from "react";
import { cases, faqs } from "@/components/data";
import { useGetUserQuery } from "@/slice/auth/index.service";
import {
  useGetDashboardDataQuery,
  useGetTenantCasesQuery,
} from "@/slice/tenants/index.service";
import { router } from "expo-router";

export default function HomeScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery({});
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboardDataQuery({});
  const {
    data: tenantCases,
    isLoading: tenantCasesLoading,
    error: tenantCasesError,
  } = useGetTenantCasesQuery({});

  const activeCases = dashboardData?.activeCases?.count || 0;
  const requiresAttention = dashboardData?.activeCases?.requiresAttention || 0;
  const resolvedIssues = dashboardData?.resolvedIssues?.count || 0;

  const user = userData?.data || {};
  const dashboard = dashboardData?.data || {};
  const tenants = tenantCases?.data || {};

  console.log("Dashboard Data:", dashboard);
  console.log("Tenant Cases:", tenants);

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
          </View>
        )}
        {tenantCasesError && (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-sm">
              Error fetching tenant cases
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
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#667085" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row gap-3 items-center">
          <View className="relative flex-1">
            <TextInput
              placeholder="Search"
              className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-500 font-medium pl-10"
            />
            <Ionicons
              name="search-outline"
              size={20}
              color="#98A2B3"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </View>

          <TouchableOpacity className="bg-primary-500 p-3 rounded-lg">
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View className="mt-6">
          <Text className="text-2xl font-semibold text-neutral-900">
            Welcome back, {user?.userFirstName || ""} 👋
          </Text>
          <Text className="text-sm text-neutral-500">
            Manage your property issues effortlessly
          </Text>
        </View>

        {/* Report Damages Card */}
        <TouchableOpacity className="flex-row items-center p-4 mt-4 bg-gray-100 rounded-xl">
          <View className="flex-1">
            <Text className="text-base font-semibold text-primary-700">
              Report damages
            </Text>
            <Text className="mt-1 text-sm text-neutral-500">
              Let us know about any damage that needs attention.
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
              Active Cases
            </Text>
            <AntDesign name="warning" size={24} color="#B91C1C" />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {activeCases}
          </Text>

          <Text className="mt-1 text-sm text-neutral-500">
            {requiresAttention} requires attention
          </Text>
        </View>

        {/* Resolved Issues Card */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-neutral-900">
              Resolved Issues
            </Text>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#15803D"
            />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {resolvedIssues}
          </Text>

          <Text className="mt-1 text-sm text-neutral-500">Last 30 days</Text>
        </View>

        {/* Scheduled Inspections Card */}
        <View className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-neutral-900">
              Scheduled Inspections
            </Text>
            <AntDesign name="calendar" size={24} color="#2387D4" />
          </View>
          <Text className="mt-2 text-3xl font-bold text-neutral-900">
            {dashboard.scheduledInspections || 0}
          </Text>
          <View className="flex-row gap-1 items-center mt-1">
            <Text className="text-sm text-primary-500">Next:</Text>
            <Text className="text-sm text-neutral-500">
              {dashboard.nextInspection || "No upcoming inspections"}
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
              label="Report New Case"
              onPress={() => router.push("/reports/report-damage")}
              iconImage={require("@/assets/images/camera-icon.png")}
              style="bg-primary-500 p-3 rounded-full w-full"
              textStyle="font-bold text-white text-base font-medium"
            />
            <Button
              label="View All Cases"
              onPress={() => router.push("/reports/all-cases")}
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
              <Text className="text-sm text-gray-500">Loading cases...</Text>
            ) : tenantCasesError ? (
              <Text className="text-sm text-red-500">Error fetching cases</Text>
            ) : tenants?.length > 0 ? (
              tenants.map((caseItem, index: number) => (
                <CaseCard key={index} {...caseItem} isRecent={false} />
              ))
            ) : (
              <Text className="text-base text-neutral-500 text-center">
                No submitted cases found
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
                    name={openIndex === index ? "minuscircleo" : "pluscircleo"}
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
              <TouchableOpacity className="mt-4 items-center bg-primary-500 p-3 px-6 rounded-full">
                <Text className="text-white font-medium">Send us a mail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

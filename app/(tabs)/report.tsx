import { cases } from "@/components/data";
import { CaseCard } from "@/components/ui/CaseCard";
import Header from "@/components/ui/Header";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  useGetDashboardDataQuery,
  useGetTenantCasesQuery,
} from "@/slice/tenants/index.service";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportScreen() {
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

  const tenants = tenantCases?.data || {};

  return (
    <SafeAreaView className="flex-1 p-4 pb-6 bg-white">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <Header title="Report" />
        <Text className="text-sm text-neutral-500 mt-1">
          Submit your Maintenance Request
        </Text>

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

        {/* report new damage */}
        <TouchableOpacity
          onPress={() => router.push("/reports/report-damage")}
          className="p-4 mt-4 bg-white rounded-2xl border border-[#E2E2E2]"
        >
          <View className="flex-row gap-4 items-center">
            <View className="bg-primary-500 p-3 rounded-lg">
              <Ionicons name="add" size={20} color="white" />
            </View>
            <View>
              <Text className="text-base font-semibold text-neutral-900">
                Report New Damage
              </Text>
              <Text className="mt-1 text-sm text-neutral-500">
                Click here to take photos and describe the issue
              </Text>
            </View>
          </View>
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

        {/* recent reports */}
        <View className="flex flex-col gap-4 mt-6">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-neutral-900">
              Recent Reports
            </Text>
            <TouchableOpacity onPress={() => router.push("/reports/all-cases")}>
              <Text className="text-sm text-primary-500">View all</Text>
            </TouchableOpacity>
          </View>

          {/* <View className="flex flex-col gap-4">
            {cases.map((caseItem, index) => (
              <CaseCard key={index} {...caseItem} isRecent={true} />
            ))}
          </View> */}

          <View className="flex flex-col gap-4">
            {tenantCasesLoading ? (
              <Text className="text-sm text-gray-500">Loading reports...</Text>
            ) : tenantCasesError ? (
              <Text className="text-sm text-red-500">
                Error fetching reports
              </Text>
            ) : tenants?.length > 0 ? (
              tenants.map((caseItem, index: number) => (
                <CaseCard key={index} {...caseItem} isRecent={false} />
              ))
            ) : (
              <Text className="text-base text-neutral-500 text-center">
                No recent reports
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


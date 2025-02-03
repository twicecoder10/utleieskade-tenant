import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";

const TABS = ["All", "Unread"] as const;
type TabType = (typeof TABS)[number];

interface Message {
  id: number;
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  avatar: string;
}

interface MessageItemProps extends Message {
  isLastItem?: boolean;
}

const MessageItem = ({
  avatar,
  name,
  message,
  time,
  unreadCount,
  isLastItem,
}: MessageItemProps) => (
  <>
    <TouchableOpacity className="flex-row items-center py-4">
      <Image
        source={{ uri: avatar }}
        className="w-12 h-12 rounded-full"
        defaultSource={{ uri: "https://i.pravatar.cc/100" }}
      />
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-neutral-900">{name}</Text>
        <Text className="text-sm text-neutral-500 mt-1" numberOfLines={1}>
          {message}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-sm text-neutral-500">{time}</Text>
        {unreadCount > 0 && (
          <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center mt-1">
            <Text className="text-xs text-white font-medium">
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
    {!isLastItem && <View className="h-px bg-neutral-100" />}
  </>
);

const LoadingState = () => (
  <View className="flex-1 justify-center items-center py-8">
    <ActivityIndicator size="large" color="#2563EB" />
    <Text className="text-neutral-500 mt-2">Loading messages...</Text>
  </View>
);

const EmptyState = () => (
  <View className="flex-1 justify-center items-center py-8">
    <Ionicons name="chatbubble-outline" size={48} color="#98A2B3" />
    <Text className="text-neutral-600 mt-2">No messages found</Text>
  </View>
);

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessages([
      {
        id: 1,
        name: "Zara smith",
        message: "Asking to be sure you saw the damage...",
        time: "12:39 AM",
        unreadCount: 2,
        avatar: "https://avatar.iran.liara.run/public",
      },
      {
        id: 2,
        name: "John Doe",
        message: "Asking to be sure you saw the damage.",
        time: "12:39 AM",
        unreadCount: 2,
        avatar: "https://avatar.iran.liara.run/public/boy",
      },
      // Add more messages as needed
    ]);
    setIsLoading(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setIsRefreshing(false);
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages
    .filter((msg) => activeTab === "All" || msg.unreadCount > 0)
    .filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <SafeAreaView className="flex-1 py-4 pb-8 bg-white">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Header title="Messages" />

        <View className="relative mt-4">
          <TextInput
            placeholder="Search messages"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="border border-gray-300 rounded-lg px-4 py-3 h-[44px] text-base text-neutral-500 font-medium pl-10"
          />
          <View className="absolute left-3 top-[11px]">
            <Ionicons name="search-outline" size={20} color="#98A2B3" />
          </View>
        </View>

        <View className="flex-row mt-4 space-x-2">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-white" : "text-neutral-600"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4">
          {isLoading ? (
            <LoadingState />
          ) : filteredMessages.length === 0 ? (
            <EmptyState />
          ) : (
            filteredMessages.map((message, index) => (
              <MessageItem
                key={message.id}
                {...message}
                isLastItem={index === filteredMessages.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

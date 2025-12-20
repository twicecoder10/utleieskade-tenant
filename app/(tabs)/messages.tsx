import Header from "@/components/ui/Header";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
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
  KeyboardAvoidingView,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useEffect, useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  useFetchChatsQuery,
  useFetchMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from "@/slice/chats/index.service";
import { useAppSelector } from "@/store/store";

type Screen = "messages" | "chat";
type MessageStatus = "sending" | "sent" | "delivered" | "read";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status?: MessageStatus;
  image?: string;
}

interface ChatUser {
  name: string;
  avatar: string;
  role: string;
  isTyping?: boolean;
}

// Chat Components
const ChatHeader = ({
  user,
  onBack,
}: {
  user: ChatUser;
  onBack: () => void;
}) => (
  <View className="flex-row items-center p-4 border-b border-gray-200">
    <TouchableOpacity onPress={onBack} className="mr-3">
      <Ionicons name="chevron-back" size={24} color="#000" />
    </TouchableOpacity>
    <Image
      source={{ uri: user.avatar }}
      className="w-10 h-10 rounded-full"
      defaultSource={{ uri: "https://i.pravatar.cc/100" }}
    />
    <View className="flex-1 ml-3">
      <Text className="text-base font-semibold">{user.name}</Text>
      <Text className="text-sm text-gray-500">
        {user.isTyping ? "Typing..." : user.role}
      </Text>
    </View>
    <View className="flex-row gap-4">
      <TouchableOpacity>
        <Feather name="phone" size={20} color="#2387D4" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="videocam-outline" size={20} color="#2387D4" />
      </TouchableOpacity>
    </View>
  </View>
);

const MessageStatus = ({ status }: { status?: MessageStatus }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return "time-outline";
      case "sent":
        return "checkmark";
      case "delivered":
        return "checkmark-done";
      case "read":
        return "checkmark-done-outline";
      default:
        return null;
    }
  };

  const icon = getStatusIcon();
  if (!icon) return null;

  return (
    <Ionicons
      name={icon}
      size={16}
      color={status === "read" ? "#fff" : "#98A2B3"}
      className="ml-1"
    />
  );
};

const MessageBubble = ({ message }: { message: Message }) => (
  <View
    className={`flex-row ${
      message.isMe ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <View
      className={`rounded-2xl px-4 py-2 max-w-[80%] ${
        message.isMe ? "bg-blue-500" : "bg-gray-100"
      }`}
    >
      {message.image && (
        <Image
          source={{ uri: message.image }}
          className="w-full h-48 rounded-lg mb-2"
          resizeMode="cover"
        />
      )}
      <Text
        className={`text-[15px] ${
          message.isMe ? "text-white" : "text-gray-800"
        }`}
      >
        {message.text}
      </Text>
      <View className="flex-row items-center justify-end mt-1">
        <Text
          className={`text-xs ${
            message.isMe ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.timestamp}
        </Text>
        {message.isMe && <MessageStatus status={message.status} />}
      </View>
    </View>
  </View>
);

const DateSeparator = ({ date }: { date: string }) => (
  <View className="flex-row justify-center my-4">
    <View className="bg-gray-100 rounded-full px-4 py-1">
      <Text className="text-sm text-gray-500">{date}</Text>
    </View>
  </View>
);

interface MessageItemProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  isLastItem?: boolean;
  onPress: () => void;
}

const MessageItem = ({
  avatar,
  name,
  message,
  time,
  unreadCount,
  isLastItem,
  onPress,
}: MessageItemProps) => (
  <>
    <TouchableOpacity className="flex-row items-center py-4" onPress={onPress}>
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

// Main Component
export default function MessagesScreen() {
  const { user } = useAppSelector((state) => state.user);
  const currentUserId = user?.userId || "";
  
  const [screen, setScreen] = useState<Screen>("messages");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets(); // Must be called at top level, not conditionally

  const { isLoggedIn } = useAppSelector((state) => state.user);

  // Fetch chats list
  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useFetchChatsQuery({}, {
    skip: !isLoggedIn, // Skip query if not logged in
    pollingInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = useFetchMessagesQuery(selectedConversationId!, {
    skip: !isLoggedIn || !selectedConversationId, // Skip if not logged in or no conversation selected
    pollingInterval: 3000, // Poll every 3 seconds for real-time message updates
  });

  const [sendMessageMutation] = useSendMessageMutation();
  const [markAsReadMutation] = useMarkAsReadMutation();

  // Transform API chats to messagesList format
  const chats = chatsData?.data || chatsData || [];
  const messagesList = chats.map((chat: any) => {
    const otherUser = chat.UserOneDetails?.userId === currentUserId 
      ? chat.UserTwoDetails 
      : chat.UserOneDetails;
    
    // Get unread count from API response
    const unreadCount = chat.unreadCount || 0;
    
    return {
      id: chat.conversationId,
      conversationId: chat.conversationId,
      name: `${otherUser?.userFirstName || ""} ${otherUser?.userLastName || ""}`.trim() || "Unknown",
      message: chat.lastMessage || "No messages yet",
      time: chat.lastMessageTimestamp 
        ? new Date(chat.lastMessageTimestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : "",
      unreadCount,
      avatar: otherUser?.userProfilePic || "https://i.pravatar.cc/100",
      role: otherUser?.userType || "User",
      receiverId: otherUser?.userId,
    };
  });

  // Filter messages list based on activeTab
  const filteredMessagesList = messagesList.filter((msg: any) => {
    if (activeTab === "Unread") {
      return msg.unreadCount > 0;
    }
    return true; // "All" shows everything
  });

  // Filter by search query
  const searchedMessagesList = filteredMessagesList.filter((msg: any) => {
    if (!searchQuery) return true;
    return msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           msg.message.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Transform API messages to Message format
  const apiMessages: Message[] = (messagesData?.data || messagesData || []).map((msg: any) => ({
    id: msg.messageId,
    text: msg.messageText,
    timestamp: new Date(msg.sentAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
    isMe: msg.senderId === currentUserId,
    status: msg.isRead && msg.senderId === currentUserId ? "read" : 
            msg.senderId === currentUserId ? "delivered" : undefined,
    image: msg.imageUrl,
  }));

  const [messages, setMessages] = useState<Message[]>([]);

  // Update messages when API data changes
  useEffect(() => {
    if (apiMessages.length > 0) {
      // Update messages with proper status based on API data
      const updatedMessages = apiMessages.map((msg) => {
        // For messages from current user, check if they've been read
        if (msg.isMe) {
          const apiMsg = (messagesData?.data || messagesData || []).find(
            (m: any) => m.messageId === msg.id
          );
          // If message is read according to API, mark as read
          if (apiMsg?.isRead) {
            return { ...msg, status: "read" as MessageStatus };
          }
          // Check if there's a newer message from the other user (reply received)
          const messageIndex = apiMessages.findIndex((m) => m.id === msg.id);
          const hasNewerReply = apiMessages.slice(messageIndex + 1).some((m) => !m.isMe);
          if (hasNewerReply) {
            return { ...msg, status: "read" as MessageStatus };
          }
          return { ...msg, status: msg.status || "delivered" as MessageStatus };
        }
        return msg;
      });
      
      setMessages(updatedMessages);
      
      // Auto-scroll to bottom when new messages arrive
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else if (selectedConversationId && !messagesLoading) {
      // Clear messages if conversation changes
      setMessages([]);
    }
  }, [messagesData, selectedConversationId]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversationId && currentUserId) {
      markAsReadMutation(selectedConversationId);
    }
  }, [selectedConversationId]);

  const simulateTyping = () => {
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 3000) as ReturnType<typeof setTimeout>;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      sendMessage(undefined, result.assets[0].uri);
    }
  };

  const sendMessage = async (text?: string, image?: string) => {
    const messageText = text || newMessage.trim();
    if ((messageText || image) && selectedUser && selectedConversationId) {
      // Optimistically add message
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        isMe: true,
        status: "sending",
        image,
      };

      setMessages((prev) => [...prev, tempMsg]);
      setNewMessage("");

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        // Get receiverId from selectedUser or messagesList
        const chat = messagesList.find((m: any) => m.conversationId === selectedConversationId);
        const receiverId = chat?.receiverId;
        
        if (!receiverId) {
          throw new Error("Receiver ID not found");
        }

        // Send message via API
        const result = await sendMessageMutation({
          receiverId,
          messageText: messageText || (image ? "Image" : ""),
        }).unwrap();

        // Update message status to sent
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMsg.id 
              ? { ...msg, id: result.data?.messageId || result.messageId || tempMsg.id, status: "sent" as MessageStatus }
              : msg
          )
        );

        // Status will be updated to "delivered" and "read" when API polls and returns updated data
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove failed message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMsg.id));
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    }
  };

  if (screen === "chat" && selectedUser) {
    const tabBarHeight = Platform.OS === "ios" ? 83 : 60; // Approximate tab bar height
    
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? tabBarHeight + insets.bottom : 20}
        >
          <ChatHeader
            user={{ ...selectedUser, isTyping }}
            onBack={() => setScreen("messages")}
          />

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <DateSeparator date="Today" />
            {messagesLoading && messages.length === 0 ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#2387D4" />
                <Text className="text-sm text-gray-500 mt-4">Loading messages...</Text>
              </View>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            ) : (
              <View className="py-8 items-center">
                <Text className="text-sm text-gray-500">No messages yet. Start the conversation!</Text>
              </View>
            )}
          </ScrollView>

          <View 
            className="bg-white border-t border-gray-100" 
            style={{ 
              paddingBottom: tabBarHeight + insets.bottom + 10,
            }}
          >
            <View className="p-4 flex-row items-center gap-3">
              <TouchableOpacity onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color="#475467" />
              </TouchableOpacity>

              <TextInput
                placeholder="Type message here..."
                value={newMessage}
                onChangeText={setNewMessage}
                className="flex-1 text-base flex-row items-center bg-gray-100 rounded-full px-4 py-3 max-h-[60px]"
                multiline
              />

              <TouchableOpacity
                onPress={() => sendMessage()}
                className="bg-primary-500 p-2 rounded-full items-center justify-center"
              >
                <FontAwesome name="send-o" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 py-4 pb-8 bg-white">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={chatsLoading}
            onRefresh={() => {
              // RTK Query will automatically refetch
            }}
          />
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
          {["All", "Unread"].map((tab) => (
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
          {chatsLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#2387D4" />
              <Text className="text-sm text-gray-500 mt-4">Loading conversations...</Text>
            </View>
          ) : chatsError ? (
            <View className="py-8 items-center">
              <Text className="text-sm text-red-500">Error loading conversations</Text>
            </View>
          ) : searchedMessagesList.length > 0 ? (
            searchedMessagesList.map((message: any, index: number) => (
              <MessageItem
                key={message.id || message.conversationId}
                {...message}
                isLastItem={index === searchedMessagesList.length - 1}
                onPress={() => {
                  setSelectedUser({
                    name: message.name,
                    avatar: message.avatar,
                    role: message.role,
                  });
                  setSelectedConversationId(message.conversationId);
                  setScreen("chat");
                }}
              />
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-sm text-gray-500">
                {activeTab === "Unread" ? "No unread messages" : "No conversations yet"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

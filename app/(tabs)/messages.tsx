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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";

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
  const [screen, setScreen] = useState<Screen>("messages");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesList, setMessagesList] = useState([
    {
      id: 1,
      name: "Zara smith",
      message: "Asking to be sure you saw the damage...",
      time: "12:39 AM",
      unreadCount: 2,
      avatar: "https://avatar.iran.liara.run/public",
      role: "Property Manager",
    },
    {
      id: 2,
      name: "John Doe",
      message: "Asking to be sure you saw the damage.",
      time: "12:39 AM",
      unreadCount: 2,
      avatar: "https://avatar.iran.liara.run/public/boy",
      role: "Property Developer",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout>();

  const simulateTyping = () => {
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
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

  const sendMessage = (text?: string, image?: string) => {
    const messageText = text || newMessage.trim();
    if (messageText || image) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        isMe: true,
        status: "sending",
        image,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      // Simulate message status
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsg.id ? { ...msg, status: "sent" } : msg
          )
        );
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
            )
          );
          simulateTyping();
          // Simulate reply
          setTimeout(() => {
            const replyMsg: Message = {
              id: Date.now().toString(),
              text: "Sure, I did.!",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              }),
              isMe: false,
            };
            setMessages((prev) => [...prev, replyMsg]);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newMsg.id ? { ...msg, status: "read" } : msg
              )
            );
          }, 4000);
        }, 1000);
      }, 1000);
    }
  };

  if (screen === "chat" && selectedUser) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ChatHeader
            user={{ ...selectedUser, isTyping }}
            onBack={() => setScreen("messages")}
          />

          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <DateSeparator date="Today" />
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </ScrollView>

          <View className="p-4 border-t border-gray-100 flex-row items-center gap-3">
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
            refreshing={isRefreshing}
            onRefresh={async () => {
              setIsRefreshing(true);
              await new Promise((resolve) => setTimeout(resolve, 1500));
              setIsRefreshing(false);
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
          {messagesList.map((message, index) => (
            <MessageItem
              key={message.id}
              {...message}
              isLastItem={index === messagesList.length - 1}
              onPress={() => {
                setSelectedUser({
                  name: message.name,
                  avatar: message.avatar,
                  role: message.role,
                });
                setScreen("chat");
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface Message {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
}

const BOT_USER = {
  _id: 2,
  name: "AI Assistant",
};

const CURRENT_USER = {
  _id: 1,
  name: "Bạn",
};

const FloatingChatBot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: 1,
      text: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm hiểu về dịch vụ nhà hàng, ăn uống hoặc trả lời các câu hỏi khác. Bạn cần hỗ trợ gì?",
      createdAt: new Date(),
      user: BOT_USER,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const toggleChat = () => {
    setIsVisible(!isVisible);
  };

  const sendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      _id: Date.now(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: CURRENT_USER,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Gửi tin nhắn tới N8N webhook
      const response = await fetch(
        "https://lamnd.app.n8n.cloud/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionId,
            action: "sendMessage",
            chatInput: userMessage.text,
          }),
        }
      );

      const data = await response.json();

      // Tạo phản hồi từ bot
      const botResponse: Message = {
        _id: Date.now() + 1,
        text:
          data.output ||
          data.reply ||
          data.message ||
          "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.",
        createdAt: new Date(),
        user: BOT_USER,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);

      // Phản hồi lỗi thân thiện
      const errorResponse: Message = {
        _id: Date.now() + 1,
        text: "Xin lỗi, hiện tại tôi gặp sự cố kết nối. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.",
        createdAt: new Date(),
        user: BOT_USER,
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, sessionId]);

  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.user._id === CURRENT_USER._id;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.botMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUser ? styles.userMessageTime : styles.botMessageTime,
            ]}
          >
            {item.createdAt.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={toggleChat}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isVisible ? "close" : "chatbubble-ellipses"}
          size={28}
          color="white"
        />
        {!isVisible && (
          <View style={styles.notificationDot}>
            <Text style={styles.notificationText}>!</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleChat}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatContainer}
          >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.botAvatar}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.botName}>Trợ lý AI</Text>
                  <Text style={styles.botStatus}>
                    {isTyping ? "Đang nhập..." : "Trực tuyến"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <View style={styles.chatMessagesContainer}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id.toString()}
                style={styles.messagesList}
                contentContainerStyle={{ paddingVertical: 10 }}
                showsVerticalScrollIndicator={false}
              />

              {isTyping && (
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDots}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                  <Text style={styles.typingText}>Trợ lý đang nhập...</Text>
                </View>
              )}
            </View>

            {/* Chat Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={!inputText.trim() ? "#ccc" : "#0B3DA9"}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B3DA9",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  chatContainer: {
    height: height * 0.7,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0B3DA9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  botName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  botStatus: {
    fontSize: 12,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
  chatMessagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  botMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#0B3DA9",
  },
  botBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: "white",
  },
  botMessageText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.7,
  },
  userMessageTime: {
    color: "white",
    textAlign: "right",
  },
  botMessageTime: {
    color: "#666",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingDots: {
    flexDirection: "row",
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0B3DA9",
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
    backgroundColor: "#f8f9fa",
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default FloatingChatBot;

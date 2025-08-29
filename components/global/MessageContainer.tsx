import { useMessage } from "@/hooks/useMessage";
import { useAppSelector } from "@/states/reduxHook";
import React from "react";
import { StyleSheet, View } from "react-native";
import InfoMessage from "./InfoMessage";

const MessageContainer: React.FC = () => {
  const messages = useAppSelector((state) => state.message.messages);
  const { hide } = useMessage();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {messages.map((message) => (
        <InfoMessage
          key={message.id}
          message={message.message}
          type={message.type}
          visible={true}
          onClose={() => hide(message.id)}
          autoHide={message.autoHide}
          autoHideDuration={message.autoHideDuration}
          position={message.position}
          showCloseButton={message.showCloseButton}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});

export default MessageContainer;

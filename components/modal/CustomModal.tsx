import { View, Text, StyleSheet, Platform, Modal, TouchableOpacity } from "react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { screenHeight } from "@/unistyles/Constants";
import Icon from "../global/Icon";
import { BlurView } from "expo-blur";

const CustomModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    openModal: (data: any) => {
      setContent(data);
      setVisible(true);
    },
    closeModal: () => {
      setVisible(false);
    },
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      {Platform.OS === "ios" && (
        <BlurView style={styles.absolute} tint="light" intensity={10} />
      )}

      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setVisible(false)}
          >
            <Icon iconFamily="Ionicons" name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {content ? (
            <View style={styles.modalContent}>{content}</View>
          ) : (
            <Text style={styles.placeholderText}>No Content Provided</Text>
          )}
        </View>
      </View>
    </Modal>
  );
});

CustomModal.displayName = "CustomModal";
export default CustomModal;

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    minHeight: 150,
    maxHeight: screenHeight * 0.7,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    // filter: Platform.OS === "ios" ? [{ blur: 4 }] : undefined,
  },
  absolute: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    width: "100%",
    maxHeight: screenHeight * 0.7,
    minHeight: 150,
    borderRadius: 10,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    fontFamily: "Okra-Medium",
  },
  closeIcon: {
    position: "absolute",
    top: -60,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 200,
    padding: 10,
    zIndex: 1,
  },    
});

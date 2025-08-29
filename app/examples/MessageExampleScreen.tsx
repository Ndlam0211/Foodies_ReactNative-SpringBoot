import CustomText from "@/components/global/CustomText";
import { useMessage } from "@/hooks/useMessage";
import { Colors } from "@/unistyles/Constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const MessageExampleScreen: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, hideAll } =
    useMessage();
  const [count, setCount] = useState(0);

  const handleAddToCart = () => {
    setCount((prev) => prev + 1);
    showSuccess(`Item added to cart! Total: ${count + 1}`, {
      autoHideDuration: 3000,
    });
  };

  const handleError = () => {
    showError("Failed to process your request. Please try again.", {
      autoHide: false,
      position: "center",
    });
  };

  const handleWarning = () => {
    showWarning("Your session will expire in 5 minutes", {
      autoHideDuration: 6000,
      position: "bottom",
    });
  };

  const handleInfo = () => {
    showInfo("New features are available. Check them out!", {
      showCloseButton: false,
      autoHideDuration: 5000,
    });
  };

  const handlePaymentSuccess = () => {
    showSuccess(
      "Payment completed successfully! Your order is being processed.",
      {
        position: "bottom",
        autoHideDuration: 4000,
      }
    );
  };

  return (
    <View style={styles.container}>
      <CustomText variant="h2" style={styles.title}>
        InfoMessage Examples
      </CustomText>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Add to Cart (Success)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.errorButton]}
          onPress={handleError}
        >
          <Text style={styles.buttonText}>Trigger Error</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={handleWarning}
        >
          <Text style={styles.buttonText}>Show Warning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={handleInfo}
        >
          <Text style={styles.buttonText}>Show Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.paymentButton]}
          onPress={handlePaymentSuccess}
        >
          <Text style={styles.buttonText}>Payment Success</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={hideAll}
        >
          <Text style={styles.buttonText}>Clear All Messages</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <CustomText variant="h6" style={styles.infoTitle}>
          Current cart count: {count}
        </CustomText>
        <CustomText variant="h7" style={styles.infoText}>
          Try the buttons above to see different message types and positions.
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  errorButton: {
    backgroundColor: "#F44336",
  },
  warningButton: {
    backgroundColor: "#FF9800",
  },
  infoButton: {
    backgroundColor: "#2196F3",
  },
  paymentButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: "#757575",
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: Colors.background_light,
    borderRadius: 8,
  },
  infoTitle: {
    marginBottom: 10,
  },
  infoText: {
    opacity: 0.7,
  },
});

export default MessageExampleScreen;

// Replacing file with cleaned, well-structured ChangePasswordScreen implementation
import axiosInstance from "@/api/apiConfig";
import { crudService } from "@/api/apiService";
import CustomText from "@/components/global/CustomText";
import Input from "@/components/ui/Input";
import { useMessage } from "@/hooks/useMessage";
import { loginStyles } from "@/unistyles/authStyles";
import { replace } from "@/utils/NavigationUtils";
import { current } from "@reduxjs/toolkit";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "react-native-unistyles";

const stylesLocal = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 18,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    lineHeight: 18,
  },
  form: {
    marginTop: 6,
  },
  inputWrap: {
    marginBottom: 12,
  },
  buttonFull: {
    alignSelf: "stretch",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
});

const ChangePasswordScreen: React.FC = () => {
  const { styles } = useStyles(loginStyles);
  const { showSuccess, showError } = useMessage();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showError?.("Please fill all fields.");
      return false;
    }
    if (oldPassword === newPassword) {
      showError?.("New password must be different from old password.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      showError?.("New password and confirm password do not match");
      return false;
    }
    if (newPassword.length < 6) {
      showError?.("New password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const resp = await crudService.create("change-password", {
        currentPassword: oldPassword,
        newPassword,
        confirmPassword,
      });

      const data = resp?.data;
      if (data?.success === false) {
        showError?.(data?.message || "Could not change password");
      } else {
        showSuccess?.(data?.message || "Password changed successfully");
        // replace to profile tab so user can't go back to change screen
        setTimeout(() => replace("UserBottomTab", { screen: "Profile" }), 600);
      }
    } catch (err: any) {
      const errorResponse = err?.response?.data;
      if (errorResponse?.message) showError?.(errorResponse.message);
      else showError?.("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={[styles.container, stylesLocal.scrollContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={stylesLocal.header}>
          <CustomText
            variant="h2"
            fontFamily="Okra-Bold"
            style={stylesLocal.title}
          >
            Change password
          </CustomText>
          <CustomText fontSize={12} style={stylesLocal.subtitle}>
            Update your account password. Use a strong password to keep your
            account secure.
          </CustomText>
        </View>

        <View style={stylesLocal.form}>
          <View style={stylesLocal.inputWrap}>
            <Input
              title="Old"
              value={oldPassword}
              onChangeText={setOldPassword}
              isPassword
            />
          </View>

          <View style={stylesLocal.inputWrap}>
            <Input
              title="New"
              value={newPassword}
              onChangeText={setNewPassword}
              isPassword
            />
          </View>

          <View style={stylesLocal.inputWrap}>
            <Input
              title="Confirm"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
            />
          </View>

          <TouchableOpacity
            style={[styles.buttonContainer]}
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
                Change password
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

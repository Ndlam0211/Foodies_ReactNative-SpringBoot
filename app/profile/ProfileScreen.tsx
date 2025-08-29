import { clearToken } from "@/api/apiService";
import CustomText from "@/components/global/CustomText";
import Icon from "@/components/global/Icon";
import { selectUser, setUser } from "@/states/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "@/states/reduxHook";
import { Colors } from "@/unistyles/Constants";
import { navigate, resetAndNavigate } from "@/utils/NavigationUtils";
import React from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen: React.FC = () => {
  const user = useAppSelector(selectUser) || {};
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    // simple confirmation
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // clear user and go to login
          dispatch(setUser({} as any));
          clearToken();
          resetAndNavigate("LoginScreen");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top || 20 }]}>
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("@/assets/images/user.jpg")
            }
            style={styles.avatar}
          />
        </View>
        <View style={styles.userInfo}>
          <CustomText variant="h4" fontFamily="Okra-Bold">
            {user?.name || "Lâm NĐ"}
          </CustomText>
          <CustomText fontSize={12} style={{ marginTop: 6 }}>
            {user?.email || "guest@example.com"}
          </CustomText>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigate("ProfileEditScreen")}
        >
          <Icon
            name="account-edit"
            iconFamily="MaterialCommunityIcons"
            size={22}
            color={Colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigate("OrderHistoryScreen")}
        >
          <View style={styles.cardLeft}>
            <Icon
              name="history"
              iconFamily="MaterialCommunityIcons"
              size={20}
              color={Colors.primary}
            />
            <CustomText style={styles.cardTitle}>Order History</CustomText>
          </View>
          <Icon
            name="chevron-right"
            iconFamily="MaterialCommunityIcons"
            size={20}
            color={Colors.lightText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigate("ChangePasswordScreen")}
        >
          <View style={styles.cardLeft}>
            <Icon
              name="lock-reset"
              iconFamily="MaterialCommunityIcons"
              size={20}
              color={Colors.primary}
            />
            <CustomText style={styles.cardTitle}>Change password</CustomText>
          </View>
          <Icon
            name="chevron-right"
            iconFamily="MaterialCommunityIcons"
            size={20}
            color={Colors.lightText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigate("SettingsScreen")}
        >
          <View style={styles.cardLeft}>
            <Icon
              name="cog"
              iconFamily="MaterialCommunityIcons"
              size={20}
              color={Colors.primary}
            />
            <CustomText style={styles.cardTitle}>Settings</CustomText>
          </View>
          <Icon
            name="chevron-right"
            iconFamily="MaterialCommunityIcons"
            size={20}
            color={Colors.lightText}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutRow}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon
            name="logout"
            iconFamily="MaterialCommunityIcons"
            size={20}
            color="#fff"
          />
          <CustomText color="#fff" style={{ marginLeft: 10 }}>
            Logout
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_light,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userInfo: {
    flex: 1,
  },
  editButton: {
    padding: 6,
    borderRadius: 8,
  },
  cardsContainer: {
    marginTop: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    marginLeft: 4,
    fontSize: 14,
  },
  logoutRow: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary || "#d9534f",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
});

export default ProfileScreen;

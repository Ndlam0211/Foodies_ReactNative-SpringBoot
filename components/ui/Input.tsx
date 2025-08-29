import { Colors } from "@/unistyles/Constants";
import { phoneStyles } from "@/unistyles/phoneStyles";
import React, { FC } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import CustomText from "../global/CustomText";
import Icon from "../global/Icon";

interface PhoneInputProps {
  value: string;
  title: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isPassword?: boolean;
}

const Input: FC<PhoneInputProps> = ({
  value,
  title,
  onChangeText,
  onFocus,
  onBlur,
  isPassword,
}) => {
  const { styles } = useStyles(phoneStyles);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  return (
    <View style={styles.container}>
      <Pressable style={styles.countryPickerContainer}>
        <CustomText variant="h6" fontFamily="Okra-Bold">
          {title}
        </CustomText>
        {/* <CustomText variant="h2"> 🇻🇳</CustomText>
        <Icon
          iconFamily="Ionicons"
          name="caret-down-sharp"
          color={Colors.lightText}
          size={18}
        /> */}
      </Pressable>

      <View style={styles.phoneInputContainer}>
        <TextInput
          placeholder={`Enter ${title}`}
          value={value}
          secureTextEntry={
            isPassword
              ? secureTextEntry
              : title === "Password"
              ? secureTextEntry
              : false
          }
          placeholderTextColor={Colors.lightText}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[styles.input, { flex: 1 }]}
        />
        {(isPassword || title === "Password") && (
          <Pressable
            onPress={() => setSecureTextEntry((prev) => !prev)}
            style={{ padding: 8 }}
          >
            <Icon
              iconFamily="Ionicons"
              name={secureTextEntry ? "eye-off" : "eye"}
              color={Colors.lightText}
              size={20}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Input;

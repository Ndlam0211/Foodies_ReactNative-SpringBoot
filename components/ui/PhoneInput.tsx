import { View, Text, Pressable, TextInput } from 'react-native'
import React, { FC } from 'react'
import { useStyles } from 'react-native-unistyles';
import { phoneStyles } from '@/unistyles/phoneStyles';
import CustomText from '../global/CustomText';
import Icon from '../global/Icon';
import { Colors } from '@/unistyles/Constants';

interface PhoneInputProps {
    value: string;
    onChangeText: (text:string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

const PhoneInput:FC<PhoneInputProps> = ({value, onChangeText, onFocus, onBlur}) => {
    const {styles} = useStyles(phoneStyles);

  return (
    <View style={styles.container}>
      <Pressable style={styles.countryPickerContainer}>
        <CustomText variant="h2"> 🇻🇳</CustomText>
        <Icon
          iconFamily="Ionicons"
          name="caret-down-sharp"
          color={Colors.lightText}
          size={18}
        />
      </Pressable>

      <View style={styles.phoneInputContainer}>
        <CustomText fontFamily="Okra-Bold">+84</CustomText>
        <TextInput
          placeholder="Enter Mobile Number"
          keyboardType="phone-pad"
          value={value}
          placeholderTextColor={Colors.lightText}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={10}
          style={styles.input}
        />
      </View>
    </View>
  );
}

export default PhoneInput
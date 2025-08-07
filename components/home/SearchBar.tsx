import { View, TouchableOpacity, SafeAreaView, Pressable, Image } from 'react-native'
import React from 'react'
import { useStyles } from 'react-native-unistyles';
import { homeStyles } from '@/unistyles/homeStyles';
import { useSharedState } from '@/app/tabs/SharedContext';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Icon from '../global/Icon';
import { Colors } from '@/unistyles/Constants';
import CustomText from '../global/CustomText';
import RollingContent from 'react-native-rolling-bar'

const searchItems: string[] = [
  'Search "chai samosa"',
  'Search "Cake"',
  'Search "ice cream"',
  'Search "pizza"',
  'Search "Biryani"',
];

const SearchBar = () => {
    const isVegMode = true;
    const { styles } = useStyles(homeStyles);
    const { scrollYGlobal } = useSharedState();

    // ✅ Tạo hiệu ứng đổi màu chữ theo scrollY
    const textColorAnimation = useAnimatedStyle(() => {
        const textColor = interpolate(scrollYGlobal.value, [0, 80], [255, 0]);

        return {
          color: `rgb(${textColor}, ${textColor}, ${textColor})`,
        };
    });

    return (
      <>
        <SafeAreaView />
        <View style={[styles.flexRowBetween, styles.padding]}>
          <TouchableOpacity
            style={styles.searchInputContainer}
            activeOpacity={0.8}
          >
            <Icon
              iconFamily="Ionicons"
              name="search"
              color={isVegMode ? Colors.active : Colors.primary}
              size={20}
            />

            <RollingContent
              interval={3000}
              defaultStyle={false}
              customStyle={styles.textContainer}
            >
              {searchItems?.map((item, index) => {
                return (
                  <CustomText
                    fontSize={12}
                    fontFamily="Okra-Medium"
                    key={index}
                    style={styles.rollingText}
                  >
                    {item}
                  </CustomText>
                );
              })}
            </RollingContent>

            <Icon
              iconFamily="Ionicons"
              name="mic-outline"
              color={isVegMode ? Colors.active : Colors.primary}
              size={20}
            />
          </TouchableOpacity>

          <Pressable style={styles.vegMode} onPress={() => {}}>
            <Animated.Text style={[textColorAnimation, styles.animatedText]}>
              VEG
            </Animated.Text>
            <Animated.Text style={[textColorAnimation, styles.animatedSubText]}>
              MODE
            </Animated.Text>
            <Image
              source={
                isVegMode
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets/icons/switch_off.png")
              }
              style={styles.switch}
            />
          </Pressable>
        </View>
      </>
    );
}

export default SearchBar
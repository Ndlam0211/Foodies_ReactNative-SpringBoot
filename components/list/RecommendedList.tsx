import { View, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { cardStyles } from "@/unistyles/cardStyles";
import { useStyles } from "react-native-unistyles";
import ScalePress from "@/components/ui/ScalePress";
import { navigate } from "@/utils/NavigationUtils";
import CustomText from "../global/CustomText";
import { Colors } from "@/unistyles/Constants";
import CustomGradient from "../global/CustomGradient";
import { recommendedListData } from "@/utils/dummyData";

const RecommendedList = () => {
  const { styles } = useStyles(cardStyles);

  const renderItem = ({ item }: any) => {
    return (
      <ScalePress
        style={styles.itemContainer}
        onPress={() => {
          navigate("RestaurantScreen", { item: item });
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item?.imageUrl }} style={styles.itemImage} />
          {item?.discount && (
            <View style={styles.discountContainer}>
              <CustomText
                color={Colors.background}
                fontSize={10}
                fontFamily="Okra-Bold"
              >
                {item?.discount}
              </CustomText>
              {item?.discountAmount && (
                <CustomText
                  style={{ lineHeight: 11 }}
                  color={Colors.background}
                  fontSize={9}
                  fontFamily="Okra-Medium"
                >
                  {item?.discountAmount}
                </CustomText>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.bookmarkIcon}>
            <Image
              source={require("@/assets/icons/bookmark.png")}
              style={styles.bookmarkIconImage}
            />
          </TouchableOpacity>

          <CustomGradient position="bottom" />
        </View>

        <View style={styles.itemInfo}>
          <CustomText
            fontSize={10}
            color={Colors.text}
            fontFamily="Okra-Medium"
            numberOfLines={1}
          >
            {item?.name}
          </CustomText>

          <View style={styles.flexRow}>
            <Image
              source={require("@/assets/icons/clock.png")}
              style={styles.clockIcon}
            />
            <CustomText
              fontFamily="Okra-Medium"
              color={Colors.lightText}
              fontSize={9}
              numberOfLines={1}
            >
              {`${item?.time} • ${item?.distance}`}
            </CustomText>
          </View>
        </View>
      </ScalePress>
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <FlatList
        numColumns={Math.ceil(recommendedListData?.length / 2)}
        data={recommendedListData}
        scrollEnabled={false}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedContainer}
      />
    </ScrollView>
  );
};

export default RecommendedList;

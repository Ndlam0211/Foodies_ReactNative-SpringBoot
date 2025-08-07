import { View, Text, Image } from 'react-native'
import React, { FC } from 'react'
import { useStyles } from 'react-native-unistyles'
import { restaurantStyles } from '@/unistyles/restuarantStyles'
import ScalePress from '../ui/ScalePress'
import { navigate } from '@/utils/NavigationUtils'
import CustomText from '../global/CustomText'
import DottedLine from '../ui/DottedLine'
import StarRating from '../ui/StarRating'

const RestaurantCard:FC<{item:any}> = ({item}) => {
    const {styles} = useStyles(restaurantStyles);
  return (
    <ScalePress onPress={() => navigate("RestaurantScreen", { item: item })}>
      <View style={styles.card}>
        <View>
          <Image source={{ uri: item?.imageUrl }} style={styles.image} />
        </View>

        <View style={styles.info}>
          <View style={styles.textContainer}>
            <View style={styles.textPart}>
              <CustomText
                variant="h5"
                style={styles.name}
                numberOfLines={1}
                fontFamily="Okra-Bold"
              >
                {item?.name}
              </CustomText>
              <CustomText>
                {item.time} • {item?.distance} • $15 for one
              </CustomText>
            </View>

            <StarRating rating={item?.rating} />
          </View>

          <DottedLine />

          {item?.discount && (
            <CustomText>
              {item.discount}{' '} {item?.discountAmount && `• ${item?.discountAmount}`}
            </CustomText>
          )}
        </View>
      </View>
    </ScalePress>
  );
}

export default RestaurantCard
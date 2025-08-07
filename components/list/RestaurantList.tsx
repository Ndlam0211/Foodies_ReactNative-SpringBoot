import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useStyles } from 'react-native-unistyles'
import { cardStyles } from '@/unistyles/cardStyles'
import RestaurantCard from './RestaurantCard'
import CustomText from '../global/CustomText'
import { recommendedListData } from '@/utils/dummyData'

const RestaurantList = () => {
  const {styles} = useStyles(cardStyles);
  
  const renderItem = ({item}:any) => {
    return (<RestaurantCard item={item} />)
  }

  return (
    <View>
      <CustomText
        style={styles.centerText}
        fontFamily='Okra-Bold'
        fontSize={12}
      >
        8889 restaurants delivering to you
      </CustomText>

      <CustomText
        style={styles.centerText}
        fontFamily='Okra-Medium'
        fontSize={12}
      >
        FEATURED
      </CustomText>

      <FlatList
              data={recommendedListData}
              scrollEventThrottle={16}
              bounces={false}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return (
                  <View style={{justifyContent:'center', alignItems:'center', opacity:0.6}}>
                    <CustomText fontFamily='Okra-Medium' variant='h1' > Made with ❤️</CustomText>
                    <CustomText fontFamily='Okra-Medium' variant='h5' > By - Lâm NĐ</CustomText>
                  </View>
                )
              }}  
      />
    </View>
  )
}

export default RestaurantList
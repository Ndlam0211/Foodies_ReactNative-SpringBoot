import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useStyles } from 'react-native-unistyles'
import { cardStyles } from '@/unistyles/cardStyles'
import RestaurantCard from './RestaurantCard'
import CustomText from '../global/CustomText'
import { recommendedRestaurantListData } from "@/utils/dummyData";
import { crudService } from '@/api/apiService'

interface Restaurant {
  id: number | string;
  name: string;
  imageUrl: string;
  time: string;
  distance: string;
  discount?: string;
  discountAmount?: string;
}

const RestaurantList = () => {
  const {styles} = useStyles(cardStyles);

  const [data, setData] = React.useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      crudService.getAll({ resource: "public/restaurants" })
        .then((response) => {
          setData(response);
        }).catch((error) => {
          console.error("Error fetching restaurants: ", error.response?.data || error.message);
        });
    };
    fetchData();
  }, []);
  
  const renderItem = ({item}:any) => {
    return (<RestaurantCard item={item} />)
  }

  return (
    <View>
      <CustomText
        style={styles.centerText}
        fontFamily="Okra-Bold"
        fontSize={12}
      >
        8889 restaurants delivering to you
      </CustomText>

      <CustomText
        style={styles.centerText}
        fontFamily="Okra-Medium"
        fontSize={12}
      >
        FEATURED
      </CustomText>

      <FlatList
        data={data}
        scrollEventThrottle={16}
        bounces={false}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.6,
              }}
            >
              <CustomText fontFamily="Okra-Medium" variant="h1">
                {" "}
                Made with ❤️
              </CustomText>
              <CustomText fontFamily="Okra-Medium" variant="h5">
                {" "}
                By - Lâm NĐ
              </CustomText>
            </View>
          );
        }}
      />
    </View>
  );
}

export default RestaurantList
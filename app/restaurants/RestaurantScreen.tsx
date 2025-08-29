import React, { FC, useEffect } from "react";
import { View, Platform, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";

import CustomSafeAreaView from "@/components/global/CustomSafeAreaView";
import SortingAndFilters from "@/components/home/SortingAndFilters";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import { restaurantsItemfiltersOption } from "@/utils/dummyData";
import { restaurantHeaderStyles } from "@/unistyles/restuarantStyles";
import DottedLine from "@/components/ui/DottedLine";
import FoodCard from "@/components/restaurant/FoodCard";
import SearchAndOffers from "@/components/restaurant/SearchAndOffers";
import { crudService } from "@/api/apiService";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  image: string;
}

const RestaurantScreen: FC = () => {
  const route = useRoute() as any;
  const restaurant = route?.params?.item;
  const { styles } = useStyles(restaurantHeaderStyles);
  const insets = useSafeAreaInsets();
  const [data, setData] = React.useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await crudService
        .getById({ resource: "public/menu-items/restaurant", id: restaurant?.id })
        .then((response) => {
          setData(response);
        })
        .catch((error) => {
          console.error(
            "Error fetching recommended restaurants: ",
            error.response?.data || error.message
          );
        });
    };
    fetchData();
  }, []);

  const renderItem = ({item} : any) => {
    return (
      <FoodCard item={item} restaurant={restaurant} />
    )
  }

  return (
    <CustomSafeAreaView>
      {/* Chừa khoảng trống theo status bar cho Android */}
      <View style={{ height: Platform.OS === "android" ? insets.top : 0 }} />

      <RestaurantHeader title={restaurant?.name} />

      <View style={styles.sortingContainer}>
        <SortingAndFilters
          menuTitle="Filter"
          options={restaurantsItemfiltersOption}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.mainPadding}>
            <DottedLine />
          </View>
        )}
        contentContainerStyle={styles.scrollContainer}
      />

      <SearchAndOffers item={restaurant} />
    </CustomSafeAreaView>
  );
};

export default RestaurantScreen;

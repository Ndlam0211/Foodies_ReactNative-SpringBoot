import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { useStyles } from 'react-native-unistyles'
import { cardStyles } from '@/unistyles/cardStyles'
import ScalePress from '../ui/ScalePress'
import { Image } from 'react-native'
import { regularFoodData } from '@/utils/dummyData'

const RegularFoodList = () => {
  const {styles} = useStyles(cardStyles);

  const renderItem = ({item}:any ) => {
    return(
      <ScalePress style={styles.itemContainer}>
        <Image source={{ uri: item?.imageUrl }} style={styles.regularFoodImage} />
      </ScalePress>
    )
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <FlatList
        numColumns={Math.ceil(regularFoodData?.length / 2)}
        data={regularFoodData}
        scrollEnabled={false}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.regularFoodContainer}
      />
    </ScrollView>
  );
}

export default RegularFoodList
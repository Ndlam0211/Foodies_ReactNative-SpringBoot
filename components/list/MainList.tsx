import React, { FC, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, SectionList, ViewToken } from "react-native";
import ExploreList from "@/components/list/ExploreList";
import RestaurantList from "@/components/list/RestaurantList";
import { restaurantStyles } from "@/unistyles/restuarantStyles";
import { useStyles } from "react-native-unistyles";
import { useSharedState } from "@/app/tabs/SharedContext";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import BackToTopButton from "../ui/BackToTopButton";
import { filtersOption } from "@/utils/dummyData";
import SortingAndFilters from "../home/SortingAndFilters";

  const sectionedData = [
    {
      title: "Explore",
      data: [{}],
      renderItem: () => <ExploreList />,
    },
    {
      title: "Restaurants",
      data: [{}],
      renderItem: () => <RestaurantList />,
    },
  ];

const MainList: FC = () => {
    const { styles } = useStyles(restaurantStyles);
    const { scrollY, scrollToTop, scrollYGlobal } = useSharedState();

    const previousScrollYTopButton = useRef<number>(0);
    const prevScrollY = useRef(0);
    const sectionListRef = useRef<SectionList>(null);

    const [isRestaurantVisible, setIsRestaurantsVisible] = useState(false);
    const [isNearEnd, setIsNearEnd] = useState(false);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event?.nativeEvent?.contentOffset?.y;

      // Scroll direction check
      const isScrollingDown = currentScrollY > prevScrollY?.current;

      // Animate scrollY based on direction
      scrollY.value = isScrollingDown
        ? withTiming(1, { duration: 300 })
        : withTiming(0, { duration: 300 });

      // Update global scroll value
      scrollYGlobal.value = currentScrollY;
      prevScrollY.current = currentScrollY;

      // Check if near bottom
      const containerHeight = event.nativeEvent.contentSize.height;
      const layoutHeight = event?.nativeEvent?.layoutMeasurement?.height;
      const offset = event?.nativeEvent?.contentOffset?.y;

      // Gần cuối danh sách (ví dụ: cách 500px)
      setIsNearEnd(offset + layoutHeight >= containerHeight - 500);
    };

    const handleScrollToTop = async () => {
        scrollToTop()
        sectionListRef.current?.scrollToLocation({
            sectionIndex:0,
            itemIndex:0,
            animated:true,
            viewPosition:0,
        })
    };

    const backToTopStyle = useAnimatedStyle(() => {
      const isScrollingUp =
        scrollYGlobal?.value < previousScrollYTopButton.current &&
        scrollYGlobal.value > 180;

      const opacity = withTiming(
        isScrollingUp && (isRestaurantVisible || isNearEnd) ? 1 : 0,
        { duration: 300 }
      );

      const translateY = withTiming(
        isScrollingUp && (isRestaurantVisible || isNearEnd) ? 0 : 10,
        { duration: 300 }
      );

      // Cập nhật giá trị cũ
      previousScrollYTopButton.current = scrollYGlobal.value;

      return {
        opacity,
        transform: [{ translateY }],
      };
    });

    const viewabilityConfig = {
      viewAreaCoveragePercentThreshold: 80,
    };

    const onViewableItemsChanged = ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
    }) => {
      const restaurantVisible = viewableItems.some(
        (item) => item?.section?.title === "Restaurants" && item?.isViewable
      );

      setIsRestaurantsVisible(restaurantVisible);
    };

    return (
        <>
            <Animated.View style={[styles.backToTopButton,backToTopStyle]}>
                <BackToTopButton onPress={handleScrollToTop} />
            </Animated.View>
            <SectionList 
                sections={sectionedData} 
                overScrollMode="always"
                onScroll={handleScroll}
                ref={sectionListRef}
                scrollEventThrottle={16}
                bounces={false}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyExtractor={(item,index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                stickySectionHeadersEnabled={true}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                renderSectionHeader={({section}) => {
                    if (section.title !== "Restaurants") {
                        return null
                    }
                    return (
                        <Animated.View style={[ isRestaurantVisible || isNearEnd ? styles.shadowBottom : null ]}>
                            <SortingAndFilters menuTitle='Sort' options={filtersOption} />
                        </Animated.View>
                    )
                }}
            />
        </>
    );
};

export default MainList;

import { useRef } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { styled, View } from 'tamagui';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { data, OnboardingData } from '@/data';
import RenderItem from '../components/RenderItem';
import Pagination from '../components/Pagination';

const HomeScreen = () => {
  const flatlistRef = useRef<FlatList<OnboardingData>>(null);
  const flatlistIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const handleViewableItemChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== null) {
      flatlistIndex.value = viewableItems[0].index;
    }
  };

  const Container = styled(View, {
    flex: 1,
  });

  const PaginationContainer = styled(View, {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    paddingVertical: 30,
  });

  return (
    <Container>
      <Animated.FlatList
        ref={flatlistRef}
        data={data}
        renderItem={({ item, index }) => {
          return <RenderItem item={item} index={index} x={x} />;
        }}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemChange}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <PaginationContainer>
        <Pagination data={data} x={x} />
      </PaginationContainer>
    </Container>
  );
};

export default HomeScreen;

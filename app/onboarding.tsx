import { useRef } from 'react';
import { ViewToken, FlatList, FlatListProps } from 'react-native';
import { styled, View } from 'tamagui';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { data, OnboardingData } from '@/data';
import OnboardingCard from './components/OnboardingCard';
import Pagination from './components/Pagination';
import CustomButton from './components/CustomButton';

const OnboardingScreen = () => {
  const flatlistRef = useRef(null);
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
    if (viewableItems[0] && viewableItems[0].index !== null) {
      flatlistIndex.value = viewableItems[0].index;
    }
  };

  const Container = styled(View, {
    flex: 1,
  });

  const PaginationContainer = styled(View, {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    paddingVertical: 30,
  });

  const AnimatedFlatlist =
    Animated.createAnimatedComponent<FlatListProps<OnboardingData>>(FlatList);

  return (
    <Container>
      <AnimatedFlatlist
        ref={flatlistRef}
        data={data}
        renderItem={({ item, index }) => (
          <OnboardingCard item={item} index={index} x={x} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
        <CustomButton
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          dataLength={data.length}
          x={x}
        />
      </PaginationContainer>
    </Container>
  );
};

export default OnboardingScreen;

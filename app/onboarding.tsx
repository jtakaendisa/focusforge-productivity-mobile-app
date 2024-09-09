import { Redirect } from 'expo-router';
import { useRef } from 'react';
import { FlatList, ViewToken } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { styled, View } from 'tamagui';

import { data, OnboardingData } from '@/data';
import CustomButton from './components/onboarding/CustomButton';
import OnboardingCard from './components/onboarding/OnboardingCard';
import Pagination from './components/onboarding/Pagination';
import { useAuthStore } from './store';

const OnboardingScreen = () => {
  const authUser = useAuthStore((s) => s.authUser);

  const listRef = useRef<FlatList<OnboardingData> | null>(null);
  const listIndex = useSharedValue(0);
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
      listIndex.value = viewableItems[0].index;
    }
  };

  if (authUser) return <Redirect href="/(drawer)/(tabs)/" />;

  return (
    <Container>
      <Animated.FlatList
        ref={listRef}
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
          listRef={listRef}
          listIndex={listIndex}
          dataLength={data.length}
          x={x}
        />
      </PaginationContainer>
    </Container>
  );
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

export default OnboardingScreen;

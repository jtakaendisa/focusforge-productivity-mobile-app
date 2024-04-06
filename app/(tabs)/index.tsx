import { useRef } from 'react';
import { styled, View } from 'tamagui';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';

import { data, OnboardingData } from '@/data';
import RenderItem from '../components/RenderItem';

const HomeScreen = () => {
  const flatlistRef = useRef<FlatList<OnboardingData>>(null);
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const Container = styled(View, {
    flex: 1,
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
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
};

export default HomeScreen;

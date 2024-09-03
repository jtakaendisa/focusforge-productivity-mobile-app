import { TIMER_LIST_ITEM_WIDTH } from '@/app/constants';
import { memo, useEffect } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TimerListItem from './TimerListItem';

interface Props {
  containerHeight: number;
  timers: number[];
  isCountingDown: boolean;
  onSelect: (index: number) => void;
}

const CircularCarousel = ({
  containerHeight,
  timers,
  isCountingDown,
  onSelect,
}: Props) => {
  const scrollX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;

    const currentIndex = calculateCurrentIndex(contentOffsetX, TIMER_LIST_ITEM_WIDTH);
    onSelect(currentIndex);
  };

  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = isCountingDown ? withTiming(0) : withTiming(1);
  }, [isCountingDown]);

  return (
    <Animated.View style={opacityAnimation}>
      <FlatList
        data={timers}
        renderItem={({ item, index }) => (
          <TimerListItem timer={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        pagingEnabled
        scrollEnabled={!isCountingDown}
        snapToInterval={TIMER_LIST_ITEM_WIDTH}
        initialScrollIndex={4}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: TIMER_LIST_ITEM_WIDTH,
          offset: TIMER_LIST_ITEM_WIDTH * index,
          index,
        })}
        onScroll={handleScroll}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: TIMER_LIST_ITEM_WIDTH * 3,
        }}
        style={{
          width: '100%',
          height: containerHeight / 3,
        }}
      />
    </Animated.View>
  );
};

const calculateCurrentIndex = (contentOffsetX: number, itemWidth: number) =>
  Math.round(contentOffsetX / itemWidth);

export default memo(CircularCarousel);

import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import TimerListItem from './TimerListItem';
import { SCREEN_HEIGHT, TIMER_LIST_ITEM_WIDTH } from '@/app/constants';
import { memo } from 'react';

interface Props {
  timers: number[];
  onSelect: (index: number) => void;
}

const CircularCarousel = ({ timers, onSelect }: Props) => {
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;

    const currentIndex = calculateCurrentIndex(contentOffsetX, TIMER_LIST_ITEM_WIDTH);
    onSelect(currentIndex);
  };

  return (
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
        position: 'absolute',
        bottom: 0,
        height: SCREEN_HEIGHT / 3,
        borderWidth: 1,
        borderColor: 'red',
      }}
    />
  );
};

const calculateCurrentIndex = (contentOffsetX: number, itemWidth: number) =>
  Math.round(contentOffsetX / itemWidth);

export default memo(CircularCarousel);

import { UTCDate } from '@date-fns/utc';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { useMemo, useRef } from 'react';
import { styled, View } from 'tamagui';

import { DATE_CARD_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { useActivityStore } from '@/app/store';
import { toFormattedDateString } from '@/app/utils';
import DateCard from './DateCard';

const DateCarousel = () => {
  const selectedDate = useActivityStore((s) => s.selectedDate);
  const setSelectedDate = useActivityStore((s) => s.setSelectedDate);

  const weeks = useMemo(() => {
    const startDate = startOfWeek(addWeeks(new UTCDate(), -1), { weekStartsOn: 1 });
    const endDate = endOfWeek(addWeeks(new UTCDate(), 3), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const dayObjects = days.map((date) => ({
      weekday: format(date, 'EEE'),
      date,
    }));

    return dayObjects;
  }, []);

  const listRef = useRef<FlashList<(typeof weeks)[number]> | null>(null);

  const handleScrollToIndex = () => {
    const selectedIndex = weeks.findIndex(
      (week) => toFormattedDateString(week.date) === toFormattedDateString(selectedDate)
    );
    listRef.current?.scrollToIndex({
      index: selectedIndex,
      animated: true,
      viewPosition: 0.25,
    });
  };

  const handleDateSelect = (date: Date) => setSelectedDate(date);

  return (
    <Container>
      <AnimatedFlashList
        ref={listRef}
        data={weeks}
        renderItem={({ item }) => (
          <DateCard day={item} selectedDate={selectedDate} onPress={handleDateSelect} />
        )}
        keyExtractor={(item) => item.date.toString()}
        estimatedItemSize={50}
        estimatedListSize={{ height: DATE_CARD_HEIGHT, width: SCREEN_WIDTH }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollsToTop={false}
        ItemSeparatorComponent={ItemSeparator}
        extraData={selectedDate}
        onLayout={handleScrollToIndex}
      />
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: SCREEN_WIDTH,
  paddingVertical: 8,
});

const ItemSeparator = styled(View, {
  width: 10,
});

export default DateCarousel;

import { useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import moment from 'moment';
import { View, Text, styled } from 'tamagui';

import CalendarCard from '../components/tabs/home/CalendarCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [week, setWeek] = useState(0);

  const flatListRef = useRef<FlatList | null>(null);

  const itemWidths: { [key: number]: number } = {};

  const weeks = useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].flatMap((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const getOffsetByIndex = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemWidths[i] || 0;
    }
    return offset;
  };

  const scrollToItem = (index: number) => {
    const offset = getOffsetByIndex(index);
    flatListRef.current?.scrollToOffset({ offset, animated: true });
  };

  const handleLayout = () => {
    setTimeout(() => {
      const index = weeks.findIndex(
        (week) => week.date.toDateString() === value.toDateString()
      );
      scrollToItem(index);
    }, 1);
  };

  return (
    <Container>
      <TitleContainer>
        <Title>Your Schedule</Title>
      </TitleContainer>
      <DatePickerContainer>
        <DatePickerRow>
          <FlatList
            ref={flatListRef}
            data={weeks}
            keyExtractor={(item) => item.date.toString()}
            renderItem={({ item, index }) => (
              <CalendarCard
                item={item}
                index={index}
                value={value}
                itemWidths={itemWidths}
                onPress={(date) => setValue(date)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollsToTop={false}
            onLayout={handleLayout}
          />
        </DatePickerRow>
      </DatePickerContainer>
      <DateHeading>
        <Text color="#1d1d1d">{value.toDateString()}</Text>
      </DateHeading>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
});

const TitleContainer = styled(View, {
  paddingHorizontal: 16,
});

const Title = styled(Text, {
  fontSize: 28,
  fontWeight: '700',
  color: '#1d1d1d',
});

const DatePickerContainer = styled(View, {});

const DatePickerRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: SCREEN_WIDTH,
  marginHorizontal: -4,
  paddingHorizontal: 16,
});

const DateHeading = styled(View, {
  flex: 1,
  paddingVertical: 24,
  paddingHorizontal: 16,
});

export default HomeScreen;

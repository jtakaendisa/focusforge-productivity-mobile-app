import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import moment from 'moment';
import { View, Text, styled, useWindowDimensions } from 'tamagui';
import CalendarCard from '../components/tabs/home/CalendarCard';

const HomeScreen = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [week, setWeek] = useState(0);

  const flatListRef = useRef<FlatList | null>(null);
  const scrollPosition = useRef(0);

  const { width: SCREEN_WIDTH } = useWindowDimensions();

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    scrollPosition.current = contentOffset.x;
  };

  useEffect(() => {
    const scrollToPreviousPosition = () => {
      flatListRef.current?.scrollToOffset({
        offset: scrollPosition.current,
        animated: false,
      });
    };

    scrollToPreviousPosition();
  }, [value]);

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
            renderItem={({ item }) => (
              <CalendarCard
                item={item}
                value={value}
                onPress={(date) => setValue(date)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollsToTop={false}
            onScroll={handleScroll}
          />
        </DatePickerRow>
      </DatePickerContainer>
      <DateHeading>
        <Text color="#1d1d1d">{value.toDateString()}</Text>
      </DateHeading>
    </Container>
  );
};

export default HomeScreen;

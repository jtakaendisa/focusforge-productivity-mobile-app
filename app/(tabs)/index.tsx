import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';
import { View, Text, styled } from 'tamagui';

import { Todo } from '../entities';
import { useTodoStore } from '../store';
import CalendarCard from '../components/tabs/home/CalendarCard';
import TodoItem from '../components/tabs/todo/TodoItem';
import { toFormattedDateString } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TODAYS_DATE = new Date();

const HomeScreen = () => {
  const todos = useTodoStore((s) => s.todos);

  const [value, setValue] = useState<Date>(TODAYS_DATE);
  const [week, setWeek] = useState(0);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

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

  useEffect(() => {
    const filteredTodos = todos.filter(
      (todo) => todo.dueDate === toFormattedDateString(value)
    );
    setFilteredTodos(filteredTodos);
  }, [todos, value]);

  return (
    <Container>
      <TitleContainer>
        <Title>
          {TODAYS_DATE.toDateString() === value.toDateString()
            ? 'Today'
            : value.toDateString()}
        </Title>
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
      <TodosContainer>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FlashList
            data={filteredTodos}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                // onPress={handleTaskPress}
                // onDelete={handleTaskDelete}
              />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeparator}
            estimatedItemSize={20}
            contentContainerStyle={{ padding: 10 }}
          />
        </GestureHandlerRootView>
      </TodosContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
});

const TitleContainer = styled(View, {
  paddingHorizontal: 16,
  marginVertical: 4,
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

const TodosContainer = styled(View, {
  flex: 1,
  marginTop: 30,
});

const ItemSeparator = styled(View, {
  height: 6,
});

export default HomeScreen;

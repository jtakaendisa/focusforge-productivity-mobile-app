import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AnimatedFlashList, FlashList, ViewToken } from '@shopify/flash-list';
import uuid from 'react-native-uuid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, styled } from 'tamagui';

import { PriorityType, useHabitStore } from './store';
import { SCREEN_WIDTH, TODAYS_DATE } from './constants';
import { habitSchema } from './validationSchemas';
import NewHabitListItem from './components/tabs/habits/NewHabitListItem';
import Dot from './components/tabs/habits/Dot';

export type NewHabitData = z.infer<typeof habitSchema>;

type SearchParams = {
  origin: '/' | '/habits' | '/tasks';
};

const listItems = [0, 1, 2, 3];

const NewHabitScreen = () => {
  const { origin } = useLocalSearchParams<SearchParams>();

  const habits = useHabitStore((s) => s.habits);
  const setHabits = useHabitStore((s) => s.setHabits);

  const [listIndex, setListIndex] = useState(0);

  const listRef = useRef<FlashList<typeof listItems> | null>(null);

  const isFirstIndex = listIndex === 0;
  const isLastIndex = listIndex === listItems.length - 1;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewHabitData>({
    defaultValues: {
      category: 'Task',
      title: '',
      note: '',
      startDate: TODAYS_DATE,
      priority: PriorityType.normal,
      frequency: {
        type: 'daily',
      },
      reminders: [],
    },
    resolver: zodResolver(habitSchema),
  });

  const watchAllFields = watch();

  const { priority, startDate, endDate, reminders } = watchAllFields;

  const handleViewableItemChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0] && viewableItems[0].index !== null) {
      setListIndex(viewableItems[0].index);
    }
  };

  const handleNavigateBackward = () => {
    if (!isFirstIndex) {
      listRef.current?.scrollToIndex({
        index: listIndex - 1,
        animated: true,
      });
    } else {
      router.replace(origin);
    }
  };

  const handleNavigateForward = async () => {
    if (listIndex < listItems.length - 1) {
      listRef.current?.scrollToIndex({
        index: listIndex + 1,
        animated: true,
      });
    }
  };

  const onSubmit: SubmitHandler<NewHabitData> = (data) => {
    const newHabit = {
      id: uuid.v4() as string,
      ...data,
    };
    setHabits([...habits, newHabit]);
  };

  useEffect(() => {
    if (!isSubmitSuccessful) return;

    reset();
    router.replace('/habits');
  }, [isSubmitSuccessful]);

  return (
    <Container>
      <AnimatedFlashList
        ref={listRef}
        data={listItems}
        renderItem={({ item }) => (
          <NewHabitListItem
            item={item}
            control={control}
            currentPriority={priority}
            startDate={startDate}
            endDate={endDate}
            reminders={reminders}
            navigateForward={handleNavigateForward}
          />
        )}
        keyExtractor={(item) => item}
        estimatedItemSize={SCREEN_WIDTH}
        onViewableItemsChanged={handleViewableItemChange}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        extraData={[priority, startDate, endDate, reminders]}
        pagingEnabled
        horizontal
      />
      <ButtonsContainer>
        <Button onPress={handleNavigateBackward}>
          <ButtonText>{isFirstIndex ? 'CANCEL' : 'BACK'}</ButtonText>
        </Button>
        <Button style={{ maxWidth: 50 }}>
          <ButtonRow>
            {listItems.map((listItem) => (
              <Dot key={listItem} listItem={listItem} listIndex={listIndex} />
            ))}
          </ButtonRow>
        </Button>
        <Button
          onPress={isLastIndex ? handleSubmit(onSubmit) : handleNavigateForward}
          disabled={isFirstIndex}
        >
          {!isFirstIndex && (
            <ButtonText color="#C73A57">{isLastIndex ? 'SAVE' : 'NEXT'}</ButtonText>
          )}
        </Button>
      </ButtonsContainer>
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '#111111',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '#1C1C1C',
  borderTopWidth: 1,
  borderColor: '#262626',
});

const Button = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const ButtonText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

const ButtonRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
});

export default NewHabitScreen;

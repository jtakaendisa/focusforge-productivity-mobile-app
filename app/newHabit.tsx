import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatedFlashList, FlashList, ViewToken } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { Text, View, styled } from 'tamagui';

import { BackHandler } from 'react-native';
import Dot from './components/tabs/habits/Dot';
import NewHabitListItem from './components/tabs/habits/NewHabitListItem';
import AbortActionModalModule from './components/tabs/modals/AbortActionModalModule';
import ModalContainer from './components/tabs/modals/ModalContainer';
import { SCREEN_WIDTH } from './constants';
import { Activity, NewActivityData } from './entities';
import { useActivityStore } from './store';
import {
  generateCompletionDates,
  getCompletionDatesFromStorage,
  setCompletionDatesInStorage,
  toCleanedObject,
} from './utils';
import { activitySchema } from './validationSchemas';

type SearchParams = {
  origin: '/' | '/habits' | '/tasks';
};

const listItems = [0, 1, 2, 3];

const NewHabitScreen = () => {
  const { origin } = useLocalSearchParams<SearchParams>();

  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [listIndex, setListIndex] = useState(0);
  const [isAbortActionModalOpen, setIsAbortActionModalOpen] = useState(false);

  const listRef = useRef<FlashList<typeof listItems> | null>(null);

  const isFirstIndex = listIndex === 0;
  const isLastIndex = listIndex === listItems.length - 1;

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<NewActivityData>({
    defaultValues: {
      title: '',
      category: 'Task',
      startDate: new Date(),
      priority: 'Normal',
      frequency: {
        type: 'daily',
      },
    },
    resolver: zodResolver(activitySchema),
  });

  const watchAllFields = watch();

  const handleViewableItemChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0] && viewableItems[0].index !== null) {
      setListIndex(viewableItems[0].index);
    }
  };

  const navigateBackward = () => {
    if (!isFirstIndex) {
      listRef.current?.scrollToIndex({
        index: listIndex - 1,
        animated: true,
      });
    } else {
      toggleAbortActionModal();
    }
  };

  const navigateForward = async () => {
    if (listIndex < listItems.length - 1) {
      listRef.current?.scrollToIndex({
        index: listIndex + 1,
        animated: true,
      });
    }
  };

  const onSubmit: SubmitHandler<NewActivityData> = async (data) => {
    const newHabit: Activity = {
      id: uuid.v4() as string,
      type: 'habit',
      isCompleted: false,
      ...data,
    };

    // Retrieve the current completion dates map from storage
    const currentCompletionDatesMap = await getCompletionDatesFromStorage();

    // Generate completion dates
    const initialCompletionDates = generateCompletionDates(
      data.startDate!,
      data.frequency,
      data.endDate
    );

    // Update the map with the new activity
    currentCompletionDatesMap[newHabit.id] = initialCompletionDates;

    // Store the updated map back to local storage
    await setCompletionDatesInStorage(currentCompletionDatesMap);

    setActivities([...activities, toCleanedObject(newHabit)]);
  };

  const handleAbortAction = () => {
    reset();
    router.replace(origin);
  };

  const toggleAbortActionModal = useCallback(
    () => setIsAbortActionModalOpen((prev) => !prev),
    []
  );

  useEffect(() => {
    const backAction = () => {
      setIsAbortActionModalOpen(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

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
            navigateForward={navigateForward}
          />
        )}
        keyExtractor={(item) => item}
        estimatedItemSize={SCREEN_WIDTH}
        onViewableItemsChanged={handleViewableItemChange}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        extraData={watchAllFields}
        pagingEnabled
        horizontal
      />
      <ButtonsContainer>
        <Button onPress={navigateBackward}>
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
          onPress={isLastIndex ? handleSubmit(onSubmit) : navigateForward}
          disabled={isFirstIndex}
        >
          {!isFirstIndex && (
            <ButtonText color="$customRed1">{isLastIndex ? 'SAVE' : 'NEXT'}</ButtonText>
          )}
        </Button>
      </ButtonsContainer>

      <ModalContainer
        isOpen={isAbortActionModalOpen}
        closeModal={toggleAbortActionModal}
      >
        <AbortActionModalModule
          onAbort={handleAbortAction}
          closeModal={toggleAbortActionModal}
        />
      </ModalContainer>

      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '$customGray3',
  borderTopWidth: 1,
  borderColor: '$customGray2',
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

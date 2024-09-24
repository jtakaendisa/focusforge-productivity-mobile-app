import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { Text, View, styled } from 'tamagui';

import Dot from './components/tabs/habits/Dot';
import NewHabitListItem from './components/tabs/habits/NewHabitListItem';
import AbortActionModalModule from './components/tabs/modals/AbortActionModalModule';
import ModalContainer from './components/tabs/modals/ModalContainer';
import { SCREEN_WIDTH } from './constants';
import { Activity, NewActivityData } from './entities';
import useCompletionDates from './hooks/useCompletionDates';
import useFormHandler from './hooks/useFormHandler';
import useListNavigationWithAbortModal from './hooks/useListNavigationWithAbortModal';
import { useActivityStore } from './store';
import { toCleanedObject } from './utils';
import { activitySchema } from './validationSchemas';

type SearchParams = {
  origin: '/' | '/habits' | '/tasks';
};

const listItems = [0, 1, 2, 3];

const NewHabitScreen = () => {
  const { origin } = useLocalSearchParams<SearchParams>();

  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const listRef = useRef<FlashList<typeof listItems> | null>(null);

  const {
    listIndex,
    isFirstIndex,
    isLastIndex,
    isAbortActionModalOpen,
    handleViewableItemChange,
    navigateBackward,
    navigateForward,
    toggleAbortActionModal,
  } = useListNavigationWithAbortModal(listRef, listItems);

  const { completionDatesMap, generateCompletionDates, updateCompletionDatesMap } =
    useCompletionDates();

  const navigateBackToOrigin = () => router.replace(origin);

  const onSubmit: SubmitHandler<NewActivityData> = async (data) => {
    const newHabit: Activity = {
      id: uuid.v4() as string,
      type: 'habit',
      isCompleted: false,
      ...data,
    };

    // Retrieve the current completion dates map from storage
    const currentCompletionDatesMap = { ...completionDatesMap };

    // Generate completion dates
    const initialCompletionDates = generateCompletionDates(
      data.startDate!,
      data.frequency,
      data.endDate
    );

    // Update the map with the new activity
    currentCompletionDatesMap[newHabit.id] = initialCompletionDates;

    // Store the updated map back to local storage
    await updateCompletionDatesMap(currentCompletionDatesMap);

    setActivities([...activities, toCleanedObject(newHabit)]);
    navigateBackToOrigin();
  };

  const { control, watchAllFields, handleFormSubmit } = useFormHandler({
    schema: activitySchema,
    defaultValues: {
      title: '',
      category: 'Task',
      startDate: new Date(),
      priority: 'Normal',
      frequency: {
        type: 'daily',
      },
    },
    onSubmit,
  });

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
          onPress={isLastIndex ? handleFormSubmit : navigateForward}
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
          onAbort={navigateBackToOrigin}
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

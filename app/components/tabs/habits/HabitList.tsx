import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { View, styled } from 'tamagui';

import { Activity, Habit, HabitActiveTab } from '@/app/entities';
import { useActivityStore } from '@/app/store';
import ActivityListPlaceholder from '../home/ActivityListPlaceholder';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import ActivityOptionsModal from './ActivityOptionsModal';
import HabitListItem from './HabitListItem';
import { Swipeable } from 'react-native-gesture-handler';

const HabitList = () => {
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [habits, setHabits] = useState<Activity[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const listRef = useRef<FlashList<Habit> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const allHabits = useMemo(
    () => activities.filter((activity) => activity.type === 'habit'),
    [activities]
  );

  const isListEmpty = !habits.length;

  const navigateToHabitDetailsScreen = (activeTab: HabitActiveTab, habitId: string) => {
    if (!habitId.length) return;

    activityOptionsRef.current?.dismiss();
    router.push({
      pathname: '/habitDetails',
      params: { activeTab, habitId },
    });
  };

  const toggleActivityOptionsModal = (habit: Activity) => {
    setSelectedHabit(habit);
    activityOptionsRef.current?.present();
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const handleDelete = (id: string) => {
    const filteredActivities = activities.filter((activity) => activity.id !== id);
    setActivities(filteredActivities);
    listRef.current?.prepareForLayoutAnimationRender();
    activityOptionsRef.current?.close();
  };

  const handleSwipe = (
    direction: 'left' | 'right',
    selectedHabit: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => {
    setSelectedHabit(selectedHabit);

    if (direction === 'left') {
      navigateToHabitDetailsScreen('edit', selectedHabit.id);
    } else {
      toggleDeleteModal();
    }
    swipeableRef.current?.close();
  };

  useEffect(() => {
    setHabits(allHabits);
  }, [allHabits]);

  return (
    <Container isContentCentered={isListEmpty}>
      {isListEmpty ? (
        <ActivityListPlaceholder />
      ) : (
        <AnimatedFlashList
          ref={listRef}
          data={habits}
          renderItem={({ item }) => (
            <HabitListItem
              habit={item}
              showOptions={toggleActivityOptionsModal}
              onNavigate={navigateToHabitDetailsScreen}
              onSwipe={handleSwipe}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item) => item.id}
          estimatedItemSize={180}
        />
      )}
      <ActivityOptionsModal
        mode="habit"
        activityOptionsRef={activityOptionsRef}
        selectedActivity={selectedHabit}
        onDelete={handleDelete}
        onNavigate={navigateToHabitDetailsScreen}
      />
      <ModalContainer isOpen={isDeleteModalOpen} closeModal={toggleDeleteModal}>
        {selectedHabit && (
          <DeleteModalModule
            activityId={selectedHabit.id}
            variant="habit"
            onDelete={handleDelete}
            closeModal={toggleDeleteModal}
          />
        )}
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  paddingTop: 12,
  paddingHorizontal: 8,
  variants: {
    isContentCentered: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

const ItemSeparator = styled(View, {
  height: 12,
});

export default HabitList;

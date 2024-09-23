import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import { View, styled } from 'tamagui';

import { Activity } from '@/app/entities';
import useHabitList from '@/app/hooks/useHabitList';
import useListModals from '@/app/hooks/useListModals';
import { useActivityStore, useSearchStore } from '@/app/store';
import ActivityListPlaceholder from '../home/ActivityListPlaceholder';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import ActivityOptionsModal from './ActivityOptionsModal';
import HabitListItem from './HabitListItem';

interface Props {
  isSearchBarOpen: boolean;
}

const HabitList = ({ isSearchBarOpen }: Props) => {
  const setActivities = useActivityStore((s) => s.setActivities);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);

  const [selectedHabit, setSelectedHabit] = useState<Activity | null>(null);

  const listRef = useRef<FlashList<Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const handleSelect = (selectedHabit: Activity) => setSelectedHabit(selectedHabit);

  const { isDeleteModalOpen, toggleDeleteModal, toggleActivityOptionsModal } =
    useListModals(activityOptionsRef, handleSelect);

  const {
    habits,
    completionDatesMap,
    navigateToHabitDetailsScreen,
    handleDelete,
    handleSwipe,
    handleComplete,
  } = useHabitList(listRef, activityOptionsRef, handleSelect, toggleDeleteModal);

  const isListEmpty = !habits.length;

  // useEffect(() => {
  //   if (isSearchBarOpen) {
  //     setFilteredActivities(allHabits);
  //   }
  // }, [allHabits, isSearchBarOpen]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   if (!searchTerm.length) {
  //     setHabits(allHabits);
  //   } else {
  //     setHabits(
  //       allHabits.filter((habit) =>
  //         habit.title.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [isSearchBarOpen, allHabits, searchTerm]);

  // useEffect(() => {
  //   if (!isSearchBarOpen) return;

  //   if (!selectedCategories.length) {
  //     setHabits(allHabits);
  //   } else {
  //     setHabits(
  //       allHabits.filter((habit) => selectedCategories.includes(habit.category))
  //     );
  //   }
  // }, [isSearchBarOpen, allHabits, selectedCategories]);

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
              completionDates={completionDatesMap[item.id]}
              onShowOptions={toggleActivityOptionsModal}
              onNavigate={navigateToHabitDetailsScreen}
              onSwipe={handleSwipe}
              onComplete={handleComplete}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item) => item.id}
          extraData={completionDatesMap}
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

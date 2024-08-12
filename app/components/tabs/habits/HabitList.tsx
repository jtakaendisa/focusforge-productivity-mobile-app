import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { View, styled } from 'tamagui';

import {
  Activity,
  CompletionDate,
  CompletionDatesMap,
  HabitActiveTab,
} from '@/app/entities';
import { useActivityStore, useSearchStore } from '@/app/store';
import {
  getCompletionDatesFromStorage,
  setCompletionDatesInStorage,
} from '@/app/utils';
import { Swipeable } from 'react-native-gesture-handler';
import ActivityListPlaceholder from '../home/ActivityListPlaceholder';
import DeleteModalModule from '../modals/DeleteModalModule';
import ModalContainer from '../modals/ModalContainer';
import ActivityOptionsModal from './ActivityOptionsModal';
import HabitListItem from './HabitListItem';

interface Props {
  isSearchBarOpen: boolean;
}

const HabitList = ({ isSearchBarOpen }: Props) => {
  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);

  const [habits, setHabits] = useState<Activity[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Activity | null>(null);
  const [completionDatesMap, setCompletionDatesMap] = useState<CompletionDatesMap>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const listRef = useRef<FlashList<Activity> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const isListEmpty = !habits.length;

  const allHabits = useMemo(
    () => activities.filter((activity) => activity.type === 'habit'),
    [activities]
  );

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

  const handleComplete = async (
    id: string,
    updatedCompletionDates: CompletionDate[]
  ) => {
    const updatedCompletionDatesMap = {
      ...completionDatesMap,
      [id]: updatedCompletionDates,
    };
    await setCompletionDatesInStorage(updatedCompletionDatesMap);
    setCompletionDatesMap(updatedCompletionDatesMap);
  };

  useEffect(() => {
    const fetchCompletionDatesMap = async () => {
      const completionDatesMap = await getCompletionDatesFromStorage();
      setCompletionDatesMap(completionDatesMap);
    };
    fetchCompletionDatesMap();
  }, []);

  useEffect(() => {
    setHabits(allHabits);
  }, [allHabits]);

  useEffect(() => {
    if (isSearchBarOpen) {
      setFilteredActivities(allHabits);
    }
  }, [allHabits, isSearchBarOpen]);

  useEffect(() => {
    if (!isSearchBarOpen) return;

    if (!searchTerm.length) {
      setHabits(allHabits);
    } else {
      setHabits(
        allHabits.filter((habit) =>
          habit.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [isSearchBarOpen, allHabits, searchTerm]);

  useEffect(() => {
    if (!isSearchBarOpen) return;

    if (!selectedCategories.length) {
      setHabits(allHabits);
    } else {
      setHabits(
        allHabits.filter((habit) => selectedCategories.includes(habit.category))
      );
    }
  }, [isSearchBarOpen, allHabits, selectedCategories]);

  // const dummyDailyCompletionDates = [
  //   { date: '19 Jul 2024', isCompleted: false },
  //   { date: '20 Jul 2024', isCompleted: false },
  //   { date: '21 Jul 2024', isCompleted: true },
  //   { date: '22 Jul 2024', isCompleted: false },
  //   { date: '23 Jul 2024', isCompleted: false },
  //   { date: '24 Jul 2024', isCompleted: false },
  //   { date: '25 Jul 2024', isCompleted: false },
  //   { date: '26 Jul 2024', isCompleted: false },
  //   { date: '27 Jul 2024', isCompleted: false },
  //   { date: '28 Jul 2024', isCompleted: false },
  //   { date: '29 Jul 2024', isCompleted: false },
  //   { date: '30 Jul 2024', isCompleted: false },
  //   { date: '31 Jul 2024', isCompleted: false },
  //   { date: '01 Aug 2024', isCompleted: true },
  //   { date: '02 Aug 2024', isCompleted: true },
  //   { date: '03 Aug 2024', isCompleted: true },
  //   { date: '04 Aug 2024', isCompleted: true },
  //   { date: '05 Aug 2024', isCompleted: false },
  //   { date: '06 Aug 2024', isCompleted: false },
  //   { date: '07 Aug 2024', isCompleted: false },
  //   { date: '08 Aug 2024', isCompleted: false },
  //   { date: '09 Aug 2024', isCompleted: true },
  //   { date: '10 Aug 2024', isCompleted: true },
  //   { date: '11 Aug 2024', isCompleted: true },
  //   { date: '12 Aug 2024', isCompleted: false },
  //   { date: '13 Aug 2024', isCompleted: false },
  //   { date: '14 Aug 2024', isCompleted: false },
  //   { date: '15 Aug 2024', isCompleted: false },
  // ];

  // const calculateStreaks = (completionDates: CompletionDate[]) => {
  //   const timeZone = 'Africa/Harare';

  //   let currentStreak = 0;
  //   let bestStreak = 0;
  //   let tempStreak = 0;
  //   let foundCurrentStreak = false;
  //   let beginTallying = false;

  // Traverse the array from the end to the beginning
  // for (let i = completionDates.length - 1; i >= 0; i--) {
  //   const completionDate = completionDates[i];
  //   const previousCompletionDate = completionDates[i - 1];
  //   const date = parse(completionDate.date, 'dd MMM yyyy', new UTCDate());

  // Only consider dates on or before the current date
  // if (isAfter(date, setDateToMidnight(new UTCDate()))) {
  // console.log({ completionDate }, { date });
  //   continue;
  // }

  // if (!beginTallying) {
  //   // Check is previous entry was completed, if not, currentStreak remains set to 0

  //   if (!previousCompletionDate.isCompleted) {
  //     foundCurrentStreak = true;
  //   }
  //   beginTallying = true;
  // }

  // if (completionDate.isCompleted) {
  //   tempStreak++;

  //   if(!foundCurrentStreak) {
  //     currentStreak = tempStreak

  //     const previousCompletionDate
  //   }

  //   if (tempStreak > bestStreak) {
  //     bestStreak = tempStreak;
  //   }
  // } else {
  //   tempStreak = 0;
  // }

  // if (completionDate.isCompleted) {
  //   tempStreak++;
  //   if (!foundCurrentStreak) {
  //     currentStreak = tempStreak;
  //     foundCurrentStreak = true;
  //   } else {
  //     currentStreak = tempStreak;
  //   }
  //   if (tempStreak > bestStreak) {
  //     bestStreak = tempStreak;
  //   }
  // } else {
  //   if (foundCurrentStreak) {
  //     tempStreak = 0;
  //     foundCurrentStreak = false;
  //   }
  // }

  // // Ensure currentStreak is set correctly if no interruption was found
  // if (foundCurrentStreak && tempStreak > 0) {
  //   currentStreak = tempStreak;
  // }
  //   }
  //   return { currentStreak, bestStreak };
  // };

  // console.log(calculateStreaks(dummyDailyCompletionDates));

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

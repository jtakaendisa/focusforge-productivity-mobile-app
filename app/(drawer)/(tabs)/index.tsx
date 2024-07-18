import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { TabRoute, Task } from '../../entities';
import { useActivityStore, useAppStore, useTaskStore } from '../../store';
import { toFormattedDateString } from '../../utils';
import DateCarousel from '../../components/tabs/home/DateCarousel';
import ActivityListPlaceholder from '../../components/tabs/home/ActivityListPlaceholder';
import TaskList from '../../components/tabs/home/TaskList';
import CreateTaskButton from '../../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../../components/tabs/modals/TaskFrequencyModal';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';

const HomeScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const filteredActivities = useActivityStore((s) => s.filteredActivities);

  const taskListRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const isActivitiesEmpty = !filteredActivities.length;

  const handlePresentModalPress = () => taskFrequencyRef.current?.present();

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'home' && isSearchBarOpen} />
      <DateCarousel />
      <TaskListContainer isTasksEmpty={isActivitiesEmpty}>
        {isActivitiesEmpty ? (
          <ActivityListPlaceholder />
        ) : (
          <TaskList
            taskListRef={taskListRef}
            tasks={filteredActivities as Task[]}
            isCheckable
          />
        )}
      </TaskListContainer>
      <CreateTaskButton onPress={handlePresentModalPress} />
      <TaskFrequencyModal taskFrequencyRef={taskFrequencyRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '$customBlack1',
});

const TaskListContainer = styled(View, {
  flex: 1,
  marginTop: 16,
  variants: {
    isTasksEmpty: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

export default HomeScreen;

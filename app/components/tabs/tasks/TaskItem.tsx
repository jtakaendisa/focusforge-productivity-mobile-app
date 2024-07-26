import { useEffect, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, Text, styled, getTokenValue } from 'tamagui';

import { ChecklistItem, Task } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import TaskItemLeftActions from './TaskItemLeftActions';
import TaskItemRightActions from './TaskItemRightActions';
import CategoryIcon from '../CategoryIcon';
import CircularCheckbox from '../CircularCheckbox';

interface Props {
  task: Task;
  isCheckable?: boolean;
  onPress: (selectedTask: Task, hasChecklist: boolean) => void;
  onSwipe: (selectedTask: Task) => void;
  openModal: (
    modalName: 'isPrioritizeOpen' | 'isDeleteOpen' | 'isChecklistOpen'
  ) => void;
  showOptions?: (task: Task) => void;
}

const TaskItem = ({
  task,
  isCheckable,
  onPress,
  onSwipe,
  openModal,
  showOptions,
}: Props) => {
  const { id, title, isCompleted, isRecurring, note, category, checklist } = task;

  const swipeableRef = useRef<Swipeable | null>(null);

  const isChecked = useSharedValue(isCompleted ? 1 : 0);

  const hasChecklist = !!checklist?.length;
  const allCompleted = checklist?.every((item) => item.isCompleted);

  const customBlack1 = getTokenValue('$customBlack1');
  const customGray1 = getTokenValue('$customGray1');

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isChecked.value, [0, 1], ['white', customGray1]),
    textDecorationLine: isChecked.value ? 'line-through' : 'none',
  }));

  const textOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(isChecked.value, [0, 1], [1, 0.6]),
  }));

  const handleTaskCompletion = () => {
    if (hasChecklist && !allCompleted) {
      onPress(task, hasChecklist);
      openModal('isChecklistOpen');
      return;
    }
    isChecked.value = isChecked.value === 1 ? withTiming(0) : withTiming(1);
    onPress(task, hasChecklist);
  };

  const handleSwipeCompletion = (direction: 'left' | 'right') => {
    onSwipe(task);

    if (direction === 'left') {
      if (isCheckable) {
        openModal('isPrioritizeOpen');
      } else {
        router.push({
          pathname: '/taskDetails',
          params: { taskId: id, activeTab: 'edit' },
        });
      }
    }

    if (direction === 'right') {
      openModal('isDeleteOpen');
    }

    swipeableRef.current?.close();
  };

  const generateProgressText = (checklist?: ChecklistItem[]) => {
    if (!checklist?.length) return '';

    const totalItems = checklist.length;
    const completedItems = checklist.filter((item) => item.isCompleted).length;

    return completedItems === totalItems ? '' : `${completedItems}/${totalItems} done`;
  };

  useEffect(() => {
    isChecked.value = isCompleted ? withTiming(1) : withTiming(0);
  }, [isCompleted]);

  return (
    <AnimatedContainer
      entering={FadeIn}
      exiting={FadeOut}
      onPress={
        isCheckable
          ? handleTaskCompletion
          : isRecurring
          ? () => showOptions?.(task)
          : null
      }
    >
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={(_, dragAnimatedValue) => (
          <TaskItemLeftActions
            dragAnimatedValue={dragAnimatedValue}
            isCheckable={isCheckable}
          />
        )}
        renderRightActions={(_, dragAnimatedValue) => (
          <TaskItemRightActions dragAnimatedValue={dragAnimatedValue} />
        )}
        onSwipeableOpen={(direction) => handleSwipeCompletion(direction)}
      >
        <TaskContainer>
          {isCheckable && (
            <CheckboxContainer>
              <CircularCheckbox isChecked={isChecked} />
            </CheckboxContainer>
          )}
          <TextContainer>
            <AnimatedTitle style={textColorAnimation}>
              {toTruncatedText(title, 30)}
            </AnimatedTitle>
            {note && (
              <AnimatedNote style={textOpacityAnimation}>
                {toTruncatedText(note, 37)}
              </AnimatedNote>
            )}
          </TextContainer>
          <InfoContainer>
            <MetricsContainer>
              <CategoryBadge>
                <BadgeText>{category}</BadgeText>
              </CategoryBadge>
              <ProgressText>{generateProgressText(checklist)}</ProgressText>
            </MetricsContainer>
            <CategoryContainer>
              <CategoryIcon category={category} fill={customBlack1} />
            </CategoryContainer>
          </InfoContainer>
        </TaskContainer>
      </Swipeable>
    </AnimatedContainer>
  );
};

const TaskContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 72,
  paddingHorizontal: 6,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const CheckboxContainer = styled(View, {
  width: 36,
});

const TextContainer = styled(View, {
  flex: 1,
  gap: 6,
  overflow: 'hidden',
});

const InfoContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
});

const MetricsContainer = styled(View, {
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  height: 36,
  paddingRight: 6,
});

const CategoryBadge = styled(View, {
  paddingHorizontal: 3,
  paddingVertical: 2,
  backgroundColor: '$customGray4',
  borderRadius: 4,
});

const BadgeText = styled(Text, {
  fontSize: 10,
});

const ProgressText = styled(Text, {
  fontSize: 10,
  color: '$customGray1',
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: 'gray',
  borderRadius: 8,
});

const Title = styled(Text, {
  fontSize: 16,
});

const Note = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
});

const AnimatedContainer = Animated.createAnimatedComponent(View);
const AnimatedTitle = Animated.createAnimatedComponent(Title);
const AnimatedNote = Animated.createAnimatedComponent(Note);

export default TaskItem;

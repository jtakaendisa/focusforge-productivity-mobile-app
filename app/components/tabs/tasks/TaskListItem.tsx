import { MutableRefObject, useEffect, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';

import { Activity, ChecklistItem } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import CategoryIcon from '../CategoryIcon';
import CircularCheckbox from '../CircularCheckbox';
import RippleButton from '../RippleButton';
import TaskItemLeftActions from './TaskItemLeftActions';
import TaskItemRightActions from './TaskItemRightActions';
import { categoryColorMap } from '@/app/constants';

interface Props {
  task: Activity;
  isCompleted?: boolean;
  isCheckable?: boolean;
  isPressDisabled?: boolean;
  onPress?: (task: Activity) => void;
  onSwipe: (
    direction: 'left' | 'right',
    task: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>,
    isCheckable?: boolean
  ) => void;
  onShowOptions?: (task: Activity) => void;
}

const TaskListItem = ({
  task,
  isCompleted,
  isCheckable,
  isPressDisabled,
  onPress,
  onSwipe,
  onShowOptions,
}: Props) => {
  const { type, title, note, category, checklist } = task;

  const swipeableRef = useRef<Swipeable | null>(null);

  const isChecked = useSharedValue(isCompleted ? 1 : 0);

  const customBlack1 = getTokenValue('$customBlack1');
  const customGray1 = getTokenValue('$customGray1');

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isChecked.value, [0, 1], ['white', customGray1]),
    textDecorationLine: isChecked.value ? 'line-through' : 'none',
  }));

  const textOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(isChecked.value, [0, 1], [1, 0.6]),
  }));

  const handlePress = () => {
    if (isPressDisabled) return;

    if (isCheckable) {
      onPress?.(task);
    } else {
      if (type === 'recurring task') {
        onShowOptions?.(task);
      }
    }
  };

  const handleSwipe = (direction: 'left' | 'right') =>
    onSwipe(direction, task, swipeableRef, isCheckable);

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
    <RippleButton disabled={isPressDisabled} onPress={handlePress}>
      <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
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
          onSwipeableOpen={handleSwipe}
        >
          <TaskContainer>
            {isCheckable && (
              <CheckboxContainer>
                <CircularCheckbox isChecked={isChecked} isDisabled={isPressDisabled} />
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
                {isCheckable && (
                  <ProgressText>{generateProgressText(checklist)}</ProgressText>
                )}
              </MetricsContainer>
              <CategoryContainer backgroundColor={categoryColorMap[category]}>
                <CategoryIcon category={category} fill={customBlack1} />
              </CategoryContainer>
            </InfoContainer>
          </TaskContainer>
        </Swipeable>
      </AnimatedContainer>
    </RippleButton>
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

export default TaskListItem;

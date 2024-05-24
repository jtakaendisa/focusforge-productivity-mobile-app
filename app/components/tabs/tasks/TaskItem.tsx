import { useRef } from 'react';
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
import { View, Text, styled, getTokens } from 'tamagui';

import { Task } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import TaskItemLeftActions from './TaskItemLeftActions';
import TaskItemRightActions from './TaskItemRightActions';
import CategoryIcon from '../CategoryIcon';
import Checkbox from './Checkbox';

interface Props {
  task: Task;
  onPress: (id: string) => void;
  onSwipe: (id: string) => void;
  openModal: (modalName: 'isPrioritizeOpen' | 'isDeleteOpen') => void;
}

const TaskItem = ({ task, onPress, onSwipe, openModal }: Props) => {
  const { id, title, isCompleted, note, category } = task;

  const swipeableRef = useRef<Swipeable | null>(null);

  const isChecked = useSharedValue(isCompleted ? 1 : 0);

  const white = getTokens().color.$white.val;
  const gray = getTokens().color.$gray1.val;

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isChecked.value, [0, 1], [white, gray]),
    textDecorationLine: isChecked.value ? 'line-through' : 'none',
  }));

  const textOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(isChecked.value, [0, 1], [1, 0.6]),
  }));

  const handleTaskCompletion = () => {
    isChecked.value = isChecked.value === 1 ? withTiming(0) : withTiming(1);
    onPress(id);
  };

  const handleSwipeCompletion = (direction: 'left' | 'right') => {
    onSwipe(id);

    if (direction === 'left') {
      openModal('isPrioritizeOpen');
    }

    if (direction === 'right') {
      openModal('isDeleteOpen');
    }

    swipeableRef.current?.close();
  };

  return (
    <AnimatedContainer
      entering={FadeIn}
      exiting={FadeOut}
      onPress={handleTaskCompletion}
    >
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={(_, dragAnimatedValue) => (
          <TaskItemLeftActions dragAnimatedValue={dragAnimatedValue} />
        )}
        renderRightActions={(_, dragAnimatedValue) => (
          <TaskItemRightActions dragAnimatedValue={dragAnimatedValue} />
        )}
        onSwipeableOpen={(direction) => handleSwipeCompletion(direction)}
      >
        <TaskContainer>
          <CheckboxContainer>
            <Checkbox isChecked={isChecked} />
          </CheckboxContainer>
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
              <ProgressText>0% done</ProgressText>
            </MetricsContainer>
            <CategoryContainer>
              <CategoryIcon category={category} />
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
  borderColor: '#262626',
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
  backgroundColor: 'rgba(140, 140, 140, 0.25)',
  borderRadius: 4,
});

const BadgeText = styled(Text, {
  fontSize: 10,
});

const ProgressText = styled(Text, {
  fontSize: 10,
  color: '#8c8c8c',
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
  color: '#8C8C8C',
});

const AnimatedContainer = Animated.createAnimatedComponent(View);
const AnimatedTitle = Animated.createAnimatedComponent(Title);
const AnimatedNote = Animated.createAnimatedComponent(Note);

export default TaskItem;

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

import { Todo } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import TodoItemRightActions from './TodoItemRightActions';
import CategoryIcon from '../CategoryIcon';
import Checkbox from './Checkbox';

interface Props {
  todo: Todo;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onPress, onDelete }: Props) => {
  const { id, task, isCompleted, note, category } = todo;

  const sharedIsCompleted = useSharedValue(isCompleted ? 1 : 0);

  const white = getTokens().color.$white.val;
  const gray = getTokens().color.$gray1.val;

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(sharedIsCompleted.value, [0, 1], [white, gray]),
    textDecorationLine: sharedIsCompleted.value ? 'line-through' : 'none',
  }));

  const textOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(sharedIsCompleted.value, [0, 1], [1, 0.6]),
  }));

  const handleTaskCompletion = () => {
    sharedIsCompleted.value =
      sharedIsCompleted.value === 1 ? withTiming(0) : withTiming(1);
    onPress(id);
  };

  return (
    <AnimatedContainer
      entering={FadeIn}
      exiting={FadeOut}
      onPress={handleTaskCompletion}
    >
      <Swipeable
        renderRightActions={(progressAnimatedValue, dragAnimatedValue) => (
          <TodoItemRightActions
            progressAnimatedValue={progressAnimatedValue}
            dragAnimatedValue={dragAnimatedValue}
            id={id}
            onDelete={onDelete}
          />
        )}
      >
        <TaskContainer>
          <CheckboxContainer>
            <Checkbox sharedIsCompleted={sharedIsCompleted} />
          </CheckboxContainer>
          <TextContainer>
            <AnimatedTitle style={textColorAnimation}>
              {toTruncatedText(task, 30)}
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

export default TodoItem;

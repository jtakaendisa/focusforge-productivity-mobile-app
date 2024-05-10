import { Swipeable } from 'react-native-gesture-handler';
import BouncyCheckbox from 'react-native-bouncy-checkbox/build/dist/BouncyCheckbox';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, styled } from 'tamagui';

import { Todo } from '@/app/entities';
import TodoItemRightActions from './TodoItemRightActions';
import { TaskContainer, Title } from './styled';

interface Props {
  todo: Todo;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onPress, onDelete }: Props) => {
  const { id, task, isCompleted } = todo;

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
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
        <TaskContainer onPress={() => onPress(id)}>
          <BouncyCheckbox
            size={20}
            fillColor="green"
            unFillColor="#FFFFFF"
            iconStyle={{ borderColor: 'green' }}
            innerIconStyle={{ borderWidth: 2 }}
            isChecked={isCompleted}
            onPress={(isChecked) => onPress(id)}
          />
          <Title isCompleted={isCompleted}>{task}</Title>
        </TaskContainer>
      </Swipeable>
    </AnimatedContainer>
  );
};

const AnimatedContainer = Animated.createAnimatedComponent(View);

export default TodoItem;

import { Text, View, styled } from 'tamagui';

import Animated from 'react-native-reanimated';

import useTaskFilterAnimation from '@/app/hooks/useTaskFilterAnimation';
import { useSearchStore } from '@/app/store';
import RippleButton from '../RippleButton';

const TaskFilterBar = () => {
  const taskFilter = useSearchStore((s) => s.taskFilter);
  const setTaskFilter = useSearchStore((s) => s.setTaskFilter);

  const {
    isSingleTaskSelected,
    isRecurringTaskSelected,
    textColorAnimation,
    indicatorOpacityAnimation,
  } = useTaskFilterAnimation(taskFilter);

  const handleSingleTaskFilterSelect = () => setTaskFilter('single task');

  const handleRecurringTaskFilterSelect = () => setTaskFilter('recurring task');

  return (
    <Container>
      <RippleButton flex onPress={handleSingleTaskFilterSelect}>
        <Button>
          <TextContainer>
            <AnimatedButtonText style={textColorAnimation(isSingleTaskSelected)}>
              Single Tasks
            </AnimatedButtonText>
            <AnimatedSelectionIndicator
              style={indicatorOpacityAnimation(isSingleTaskSelected)}
            />
          </TextContainer>
        </Button>
      </RippleButton>
      <RippleButton flex onPress={handleRecurringTaskFilterSelect}>
        <Button>
          <TextContainer>
            <AnimatedButtonText style={textColorAnimation(isRecurringTaskSelected)}>
              Recurring Tasks
            </AnimatedButtonText>
            <AnimatedSelectionIndicator
              style={indicatorOpacityAnimation(isRecurringTaskSelected)}
            />
          </TextContainer>
        </Button>
      </RippleButton>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  height: 48,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const Button = styled(View, {
  alignItems: 'center',
});

const TextContainer = styled(View, {
  position: 'relative',
  justifyContent: 'center',
  height: '100%',
});

const ButtonText = styled(Text, {
  fontSize: 14,
});

const SelectionIndicator = styled(View, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: '$customRed2',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
});

const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedSelectionIndicator = Animated.createAnimatedComponent(SelectionIndicator);

export default TaskFilterBar;

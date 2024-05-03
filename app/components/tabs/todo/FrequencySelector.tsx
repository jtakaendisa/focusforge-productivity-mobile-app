import { router } from 'expo-router';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { styled, View, Text } from 'tamagui';

interface Props {
  onClose: () => void;
}

const cards = [
  {
    heading: 'Habit',
    description:
      'Activity that repeats over time. It has detailed tracking and statistics.',
  },
  {
    heading: 'Recurring Task',
    description: 'Activity that repeats over time without tracking or statistics.',
  },
  {
    heading: 'Task',
    description: 'Single instance activity without tracking over time.',
  },
];

const FrequencySelector = ({ onClose }: Props) => {
  const handleCreateTask = () => {
    onClose();
    router.push('/newTask');
  };

  return (
    <AnimatedContainer entering={SlideInDown} exiting={SlideOutDown}>
      {cards.map(({ heading, description }) => (
        <CardContainer key={heading} onPress={handleCreateTask}>
          <CardIcon></CardIcon>
          <CardTextContainer>
            <CardHeading>{heading}</CardHeading>
            <CardDescription>{description}</CardDescription>
          </CardTextContainer>
          <RightArrowIcon></RightArrowIcon>
        </CardContainer>
      ))}
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingTop: 12,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  zIndex: 2,
  backgroundColor: '#946E6E',
});

const CardContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: 'white',
});

const CardIcon = styled(View, {
  width: 48,
  height: 48,
  borderWidth: 1,
  borderColor: 'white',
});

const CardTextContainer = styled(View, {
  flex: 1,
  paddingHorizontal: 16,
});

const CardHeading = styled(Text, {
  fontSize: 16,
});

const CardDescription = styled(Text, {
  fontSize: 12,
  color: '#e0e0e0',
});

const RightArrowIcon = styled(View, {
  width: 48,
  height: 48,
  borderWidth: 1,
  borderColor: 'white',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default FrequencySelector;

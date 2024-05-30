import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text } from 'tamagui';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';

const DetailsListModule = () => {
  const [inputFocusState, setInputFocusState] = useState({
    isTitleFocused: false,
    isNoteFocused: false,
  });

  const { isTitleFocused, isNoteFocused } = inputFocusState;

  const sharedIsTitleFocused = useSharedValue(isTitleFocused ? 1 : 0);
  const sharedIsNoteFocused = useSharedValue(isNoteFocused ? 1 : 0);

  const titleFieldColorAnimation = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      sharedIsTitleFocused.value,
      [0, 1],
      ['#8C8C8C', '#C73A57']
    ),
    placeholderTextColor: interpolateColor(
      sharedIsTitleFocused.value,
      [0, 1],
      ['#8C8C8C', '#fff']
    ),
  }));

  const noteFieldColorAnimation = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      sharedIsNoteFocused.value,
      [0, 1],
      ['#8C8C8C', '#C73A57']
    ),
    placeholderTextColor: interpolateColor(
      sharedIsNoteFocused.value,
      [0, 1],
      ['#8C8C8C', '#fff']
    ),
  }));

  useEffect(() => {
    sharedIsTitleFocused.value = isTitleFocused ? withTiming(1) : withTiming(0);
    sharedIsNoteFocused.value = isNoteFocused ? withTiming(1) : withTiming(0);
  }, [isTitleFocused, isNoteFocused]);

  return (
    <Container>
      <HeadingContainer>
        <Heading>Define your habit</Heading>
      </HeadingContainer>
      <AnimatedInputField
        style={titleFieldColorAnimation}
        placeholder="Habit Title..."
        onFocus={() =>
          setInputFocusState({ isNoteFocused: false, isTitleFocused: true })
        }
      />
      <ExampleHabit>e.g. Buy groceries in the morning.</ExampleHabit>
      <AnimatedInputField
        style={noteFieldColorAnimation}
        placeholder="Description (optional)"
        onFocus={() =>
          setInputFocusState({ isTitleFocused: false, isNoteFocused: true })
        }
      />
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
});

const HeadingContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  height: 94,
});

const Heading = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#C73A57',
});

const InputField = styled(TextInput, {
  height: 48,
  paddingHorizontal: 16,
  paddingVertical: 6,
  marginHorizontal: 8,
  marginVertical: 22,
  borderRadius: 8,
  borderWidth: 2,
  //@ts-ignore
  fontSize: 16,
  color: '#fff',
});

const ExampleHabit = styled(Text, {
  alignSelf: 'center',
  fontSize: 14,
  color: '#8C8C8C',
});

const AnimatedInputField = Animated.createAnimatedComponent(InputField);

export default DetailsListModule;

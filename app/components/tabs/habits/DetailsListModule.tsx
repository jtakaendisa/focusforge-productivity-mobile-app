import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { NewActivityData } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';

interface Props {
  control: Control<NewActivityData>;
}

const DetailsListModule = ({ control }: Props) => {
  const { customGray1, customRed1 } = useCustomColors();

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
      [customGray1, customRed1]
    ),
    placeholderTextColor: interpolateColor(
      sharedIsTitleFocused.value,
      [0, 1],
      [customGray1, 'white']
    ),
  }));

  const noteFieldColorAnimation = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      sharedIsNoteFocused.value,
      [0, 1],
      [customGray1, customRed1]
    ),
    placeholderTextColor: interpolateColor(
      sharedIsNoteFocused.value,
      [0, 1],
      [customGray1, 'white']
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
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <AnimatedInputField
            style={titleFieldColorAnimation}
            placeholder="Habit Title..."
            onFocus={() =>
              setInputFocusState({ isNoteFocused: false, isTitleFocused: true })
            }
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <ExampleHabit>e.g. Buy groceries in the morning.</ExampleHabit>
      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, onBlur, value } }) => (
          <AnimatedInputField
            style={noteFieldColorAnimation}
            placeholder="Description (optional)"
            onFocus={() =>
              setInputFocusState({ isTitleFocused: false, isNoteFocused: true })
            }
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
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
  color: '$customRed1',
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
  color: 'white',
});

const ExampleHabit = styled(Text, {
  alignSelf: 'center',
  fontSize: 14,
  color: '$customGray1',
});

const AnimatedInputField = Animated.createAnimatedComponent(InputField);

export default DetailsListModule;

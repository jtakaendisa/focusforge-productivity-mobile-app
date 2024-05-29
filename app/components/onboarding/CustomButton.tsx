import { MutableRefObject } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  Easing,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Image, Text, View, styled } from 'tamagui';

import { OnboardingData } from '@/data';
import { SCREEN_WIDTH } from '@/app/constants';

interface Props {
  listRef: MutableRefObject<FlashList<OnboardingData> | null>;
  listIndex: SharedValue<number>;
  dataLength: number;
  x: SharedValue<number>;
}

const animationConfig = {
  duration: 250,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const CustomButton = ({ listRef, listIndex, dataLength, x }: Props) => {
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('onboarded', JSON.stringify(true));
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handlePress = async () => {
    if (listIndex.value < dataLength - 1) {
      listRef.current?.scrollToIndex({
        index: listIndex.value + 1,
      });
    } else {
      await storeData();
      router.replace('/(auth)');
    }
  };

  const colorAnimation = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#005b4f', '#1e2169', '#f15937']
    );

    return {
      backgroundColor,
    };
  });

  const buttonAnimation = useAnimatedStyle(() => ({
    width:
      listIndex.value === dataLength - 1
        ? withTiming(140, animationConfig)
        : withTiming(60, animationConfig),
  }));

  const buttonTextAnimation = useAnimatedStyle(() => {
    return {
      opacity:
        listIndex.value === dataLength - 1
          ? withTiming(1, animationConfig)
          : withTiming(0, animationConfig),
      transform: [
        {
          translateX:
            listIndex.value === dataLength - 1
              ? withTiming(0, animationConfig)
              : withTiming(-100, animationConfig),
        },
      ],
    };
  });

  const arrowAnimation = useAnimatedStyle(() => ({
    opacity:
      listIndex.value === dataLength - 1
        ? withTiming(0, animationConfig)
        : withTiming(1, animationConfig),
    transform: [
      {
        translateX:
          listIndex.value === dataLength - 1
            ? withTiming(100, animationConfig)
            : withTiming(0, animationConfig),
      },
    ],
  }));

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <AnimatedContainer style={[colorAnimation, buttonAnimation]}>
        <AnimatedButtonText style={[buttonTextAnimation]}>
          Get Started
        </AnimatedButtonText>
        <AnimatedArrow
          source={require('@/assets/images/ArrowIcon.png')}
          style={arrowAnimation}
        />
      </AnimatedContainer>
    </TouchableWithoutFeedback>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 60,
  height: 60,
  padding: 10,
  borderRadius: 30,
  backgroundColor: 'black',
  overflow: 'hidden',
});

const ButtonText = styled(Text, {
  position: 'absolute',
});

const Arrow = styled(Image, {
  position: 'absolute',
  width: 30,
  height: 30,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedArrow = Animated.createAnimatedComponent(Arrow);

export default CustomButton;

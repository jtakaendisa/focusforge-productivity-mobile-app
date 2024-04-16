import { RefObject } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, styled, useWindowDimensions } from 'tamagui';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingData } from '@/data';

interface Props {
  flatlistRef: RefObject<FlatList<OnboardingData>>;
  flatlistIndex: SharedValue<number>;
  dataLength: number;
  x: SharedValue<number>;
}

const CustomButton = ({ flatlistRef, flatlistIndex, dataLength, x }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('onboarded', JSON.stringify(true));
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handlePress = async () => {
    if (flatlistIndex.value < dataLength - 1) {
      flatlistRef.current?.scrollToIndex({
        index: flatlistIndex.value + 1,
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
    width: flatlistIndex.value === dataLength - 1 ? withSpring(140) : withSpring(60),
    height: 60,
  }));

  const buttonTextAnimation = useAnimatedStyle(() => {
    return {
      opacity: flatlistIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatlistIndex.value === dataLength - 1 ? withTiming(0) : withTiming(-100),
        },
      ],
    };
  });

  const arrowAnimation = useAnimatedStyle(() => ({
    width: 30,
    height: 30,
    opacity: flatlistIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateX:
          flatlistIndex.value === dataLength - 1 ? withTiming(100) : withTiming(0),
      },
    ],
  }));

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
  });

  const AnimatedContainer = Animated.createAnimatedComponent(Container);
  const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
  const AnimatedArrow = Animated.createAnimatedComponent(Arrow);

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

export default CustomButton;

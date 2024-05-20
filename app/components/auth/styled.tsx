import Animated from 'react-native-reanimated';
import { Button, Image, Text, View, styled } from 'tamagui';

import { SCREEN_HEIGHT } from '@/app/constants';

const Container = styled(View, {
  flex: 1,
});

const BackgroundImage = styled(Image, {
  width: '100%',
  height: '100%',
  position: 'absolute',
});

const LightsContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-around',
  position: 'absolute',
  width: '100%',
});

const LargeLight = styled(Image, {
  width: 90,
  height: 225,
});

const SmallLight = styled(Image, {
  width: 65,
  height: 160,
});

const Title = styled(Text, {
  fontWeight: 'bold',
  fontSize: 42,
  textAlign: 'center',
});

const FormContainer = styled(View, {
  flex: 1,
  justifyContent: 'space-around',
  paddingTop: 0.22 * SCREEN_HEIGHT,
  paddingBottom: 10,
});

const InputsContainer = styled(View, {
  alignItems: 'center',
  marginHorizontal: 16,
  gap: 16,
});

const InputContainer = styled(View, {
  width: '100%',
  backgroundColor: '#DEDFDF',
  padding: 12,
  borderRadius: 24,
});

const ButtonsContainer = styled(View, {
  width: '100%',
  gap: 16,
  marginTop: 24,
});

const SubmitButton = styled(Button, {
  width: '100%',
  backgroundColor: '#33B3F4',
  borderRadius: 24,
});

const ButtonText = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
});

const SignupContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'center',
});

const ErrorText = styled(Text, {
  color: 'red',
  alignSelf: 'flex-start',
  marginTop: -12,
  marginLeft: 12,
});

const AnimatedLargeLight = Animated.createAnimatedComponent(LargeLight);
const AnimatedSmallLight = Animated.createAnimatedComponent(SmallLight);
const AnimatedTitle = Animated.createAnimatedComponent(Title);
const AnimatedInputContainer = Animated.createAnimatedComponent(InputContainer);
const AnimatedSubmitButton = Animated.createAnimatedComponent(SubmitButton);
const AnimatedSignupContainer = Animated.createAnimatedComponent(SignupContainer);

export {
  Container,
  BackgroundImage,
  LightsContainer,
  AnimatedLargeLight,
  AnimatedSmallLight,
  AnimatedTitle,
  FormContainer,
  InputsContainer,
  AnimatedInputContainer,
  ButtonsContainer,
  AnimatedSubmitButton,
  ButtonText,
  AnimatedSignupContainer,
  ErrorText,
};

import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Text, View, styled, useWindowDimensions } from 'tamagui';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';

import {
  AnimatedInputContainer,
  AnimatedLargeLight,
  AnimatedSignupContainer,
  AnimatedSmallLight,
  AnimatedSubmitButton,
  AnimatedTitle,
  BackgroundImage,
  ButtonText,
  ButtonsContainer,
  Container,
  InputsContainer,
  LightsContainer,
} from './_components';

const SigninScreen = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const FormContainer = styled(View, {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 0.22 * SCREEN_HEIGHT,
    paddingBottom: 10,
  });

  return (
    <Container>
      <BackgroundImage source={require('@/assets/images/background.png')} />
      <LightsContainer>
        <AnimatedLargeLight
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require('@/assets/images/light.png')}
        />
        <AnimatedSmallLight
          entering={FadeInUp.delay(400).duration(1000).springify()}
          source={require('@/assets/images/light.png')}
        />
      </LightsContainer>
      <FormContainer>
        <AnimatedTitle entering={FadeInUp.duration(1000).springify()}>
          Welcome
        </AnimatedTitle>
        <InputsContainer>
          <AnimatedInputContainer entering={FadeInDown.duration(1000).springify()}>
            <TextInput placeholder="Email" placeholderTextColor="gray" />
          </AnimatedInputContainer>
          <AnimatedInputContainer
            entering={FadeInDown.delay(200).duration(1000).springify()}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
            />
          </AnimatedInputContainer>
          <ButtonsContainer>
            <AnimatedSubmitButton
              entering={FadeInDown.delay(400).duration(1000).springify()}
            >
              <ButtonText>Login</ButtonText>
            </AnimatedSubmitButton>
            <AnimatedSubmitButton
              entering={FadeInDown.delay(600).duration(1000).springify()}
            >
              <ButtonText>Sign in with Google</ButtonText>
            </AnimatedSubmitButton>
          </ButtonsContainer>
          <AnimatedSignupContainer
            entering={FadeInDown.delay(800).duration(1000).springify()}
          >
            <Text color="black">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text color="#2892c7">Sign up</Text>
            </TouchableOpacity>
          </AnimatedSignupContainer>
        </InputsContainer>
      </FormContainer>
      <StatusBar style="light" />
    </Container>
  );
};

export default SigninScreen;

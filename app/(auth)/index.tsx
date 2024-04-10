import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Button, Image, Text, View, styled, useWindowDimensions } from 'tamagui';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const SigninScreen = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

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

  const FormContainer = styled(View, {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 0.2 * SCREEN_HEIGHT,
    paddingBottom: 10,
  });

  const Title = styled(Text, {
    fontWeight: 'bold',
    fontSize: 42,
    textAlign: 'center',
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

  const SubmitButton = styled(Button, {
    width: '100%',
    backgroundColor: '#33B3F4',
    marginVertical: 12,
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

  const AnimatedLargeLight = Animated.createAnimatedComponent(LargeLight);
  const AnimatedSmallLight = Animated.createAnimatedComponent(SmallLight);
  const AnimatedTitle = Animated.createAnimatedComponent(Title);
  const AnimatedInputContainer = Animated.createAnimatedComponent(InputContainer);
  const AnimatedSubmitButton = Animated.createAnimatedComponent(SubmitButton);
  const AnimatedSignupContainer = Animated.createAnimatedComponent(SignupContainer);

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
          Login
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
          <AnimatedSubmitButton
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <ButtonText>Login</ButtonText>
          </AnimatedSubmitButton>
          <AnimatedSignupContainer
            entering={FadeInDown.delay(600).duration(1000).springify()}
          >
            <Text color="black">Don't have an acount? </Text>
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

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, SubmitHandler } from 'react-hook-form';
import { TextInput, TouchableOpacity } from 'react-native';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from 'tamagui';
import { z } from 'zod';

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
  ErrorText,
  FormContainer,
  InputsContainer,
  LightsContainer,
} from '../components/auth/styled';
import useFormHandler from '../hooks/useFormHandler';
import useMountAnimation from '../hooks/useMountAnimation';
import { signInAuthUser } from '../services/auth';
import { signinSchema } from '../validationSchemas';

type SigninFormData = z.infer<typeof signinSchema>;

const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
  const { email, password } = data;

  await signInAuthUser(email, password);
  router.replace('/(drawer)/(tabs)');
};

const navigateToSignUpScreen = () => router.push('/signup');

const SigninScreen = () => {
  const playAnimations = useMountAnimation();

  const { control, errors, handleFormSubmit } = useFormHandler({
    schema: signinSchema,
    defaultValues: { email: '', password: '' },
    onSubmit,
  });

  return (
    <Container>
      <BackgroundImage source={require('@/assets/images/background.png')} />
      <LightsContainer>
        <AnimatedLargeLight
          entering={
            playAnimations ? FadeInUp.delay(200).duration(1000).springify() : undefined
          }
          source={require('@/assets/images/light.png')}
        />
        <AnimatedSmallLight
          entering={
            playAnimations ? FadeInUp.delay(400).duration(1000).springify() : undefined
          }
          source={require('@/assets/images/light.png')}
        />
      </LightsContainer>
      <FormContainer>
        <AnimatedTitle
          entering={playAnimations ? FadeInUp.duration(1000).springify() : undefined}
        >
          Welcome
        </AnimatedTitle>
        <InputsContainer>
          <AnimatedInputContainer
            entering={
              playAnimations ? FadeInDown.duration(1000).springify() : undefined
            }
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </AnimatedInputContainer>
          {errors?.email && <ErrorText>{errors.email.message}</ErrorText>}

          <AnimatedInputContainer
            entering={
              playAnimations
                ? FadeInDown.delay(200).duration(1000).springify()
                : undefined
            }
          >
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
            />
          </AnimatedInputContainer>
          {errors?.password && <ErrorText>{errors.password.message}</ErrorText>}

          <ButtonsContainer>
            <AnimatedSubmitButton
              entering={
                playAnimations
                  ? FadeInDown.delay(400).duration(1000).springify()
                  : undefined
              }
              onPress={handleFormSubmit}
            >
              <ButtonText>Login</ButtonText>
            </AnimatedSubmitButton>
            <AnimatedSubmitButton
              entering={
                playAnimations
                  ? FadeInDown.delay(600).duration(1000).springify()
                  : undefined
              }
            >
              <ButtonText>Sign in with Google</ButtonText>
            </AnimatedSubmitButton>
          </ButtonsContainer>
          <AnimatedSignupContainer
            entering={
              playAnimations
                ? FadeInDown.delay(800).duration(1000).springify()
                : undefined
            }
          >
            <Text color="black">Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignUpScreen}>
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

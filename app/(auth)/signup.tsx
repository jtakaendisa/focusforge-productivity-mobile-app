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
import { createAuthUser, createUserDocument } from '../services/auth';
import { signupSchema } from '../validationSchemas';

type SignupFormData = z.infer<typeof signupSchema>;

const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
  const { username, email, password } = data;

  const user = await createAuthUser(email, password);
  if (user) {
    await createUserDocument(user, username);
    router.replace('/(drawer)/(tabs)');
  }
};

const navigateToSignInScreen = () => router.push('/');

const SignupScreen = () => {
  const playAnimations = useMountAnimation();

  const { control, errors, handleFormSubmit } = useFormHandler({
    schema: signupSchema,
    defaultValues: { username: '', email: '', password: '' },
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
          Sign Up
        </AnimatedTitle>
        <InputsContainer>
          <AnimatedInputContainer
            entering={
              playAnimations ? FadeInDown.duration(1000).springify() : undefined
            }
          >
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </AnimatedInputContainer>
          {errors?.username && <ErrorText>{errors.username.message}</ErrorText>}

          <AnimatedInputContainer
            entering={
              playAnimations
                ? FadeInDown.delay(200).duration(1000).springify()
                : undefined
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
                ? FadeInDown.delay(400).duration(1000).springify()
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
                  ? FadeInDown.delay(600).duration(1000).springify()
                  : undefined
              }
              onPress={handleFormSubmit}
            >
              <ButtonText>Create Account</ButtonText>
            </AnimatedSubmitButton>
            <AnimatedSubmitButton
              entering={
                playAnimations
                  ? FadeInDown.delay(800).duration(1000).springify()
                  : undefined
              }
            >
              <ButtonText>Sign up with Google</ButtonText>
            </AnimatedSubmitButton>
          </ButtonsContainer>
          <AnimatedSignupContainer
            entering={
              playAnimations
                ? FadeInDown.delay(1000).duration(1000).springify()
                : undefined
            }
          >
            <Text color="black">Already have an account? </Text>
            <TouchableOpacity onPress={navigateToSignInScreen}>
              <Text color="#2892c7">Sign in</Text>
            </TouchableOpacity>
          </AnimatedSignupContainer>
        </InputsContainer>
      </FormContainer>
      <StatusBar style="light" />
    </Container>
  );
};

export default SignupScreen;

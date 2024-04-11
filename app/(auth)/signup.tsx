import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View, styled, useWindowDimensions } from 'tamagui';
import { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { signupSchema } from '../validationSchemas';
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
  InputsContainer,
  LightsContainer,
} from './_components';

type SignupFormData = z.infer<typeof signupSchema>;

const SignupScreen = () => {
  const [componentMounted, setComponentMounted] = useState(false);
  const [animationsTriggered, setAnimationsTriggered] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const { control, handleSubmit } = useForm<SignupFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setErrors(null);
    console.log({ data });
  };

  const onError: SubmitErrorHandler<SignupFormData> = async (errors) => {
    setErrors(errors);
  };

  const FormContainer = styled(View, {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 0.22 * SCREEN_HEIGHT,
    paddingBottom: 10,
  });

  useEffect(() => {
    setComponentMounted(true);
    if (!animationsTriggered) {
      setAnimationsTriggered(true);
    }
  }, [animationsTriggered]);

  return (
    <Container>
      <BackgroundImage source={require('@/assets/images/background.png')} />
      <LightsContainer>
        <AnimatedLargeLight
          entering={
            componentMounted && !animationsTriggered
              ? FadeInUp.delay(200).duration(1000).springify()
              : undefined
          }
          source={require('@/assets/images/light.png')}
        />
        <AnimatedSmallLight
          entering={
            componentMounted && !animationsTriggered
              ? FadeInUp.delay(400).duration(1000).springify()
              : undefined
          }
          source={require('@/assets/images/light.png')}
        />
      </LightsContainer>
      <FormContainer>
        <AnimatedTitle
          entering={
            componentMounted && !animationsTriggered
              ? FadeInUp.duration(1000).springify()
              : undefined
          }
        >
          Sign Up
        </AnimatedTitle>
        <InputsContainer>
          <AnimatedInputContainer
            entering={
              componentMounted && !animationsTriggered
                ? FadeInDown.duration(1000).springify()
                : undefined
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
          {errors?.username?.message?.length > 0 && (
            <ErrorText>{errors.username.message}</ErrorText>
          )}

          <AnimatedInputContainer
            entering={
              componentMounted && !animationsTriggered
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
          {errors?.email?.message?.length > 0 && (
            <ErrorText>{errors.email.message}</ErrorText>
          )}

          <AnimatedInputContainer
            entering={
              componentMounted && !animationsTriggered
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
          {errors?.password?.message?.length > 0 && (
            <ErrorText>{errors.password.message}</ErrorText>
          )}

          <ButtonsContainer>
            <AnimatedSubmitButton
              entering={
                componentMounted && !animationsTriggered
                  ? FadeInDown.delay(600).duration(1000).springify()
                  : undefined
              }
              onPress={handleSubmit(onSubmit, onError)}
            >
              <ButtonText>Create Account</ButtonText>
            </AnimatedSubmitButton>
            <AnimatedSubmitButton
              entering={
                componentMounted && !animationsTriggered
                  ? FadeInDown.delay(800).duration(1000).springify()
                  : undefined
              }
            >
              <ButtonText>Sign up with Google</ButtonText>
            </AnimatedSubmitButton>
          </ButtonsContainer>
          <AnimatedSignupContainer
            entering={
              componentMounted && !animationsTriggered
                ? FadeInDown.delay(1000).duration(1000).springify()
                : undefined
            }
          >
            <Text color="black">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
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

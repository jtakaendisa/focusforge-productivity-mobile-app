import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Controller,
  DeepRequired,
  FieldErrorsImpl,
  FieldValues,
  GlobalError,
  IsAny,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View, styled, useWindowDimensions } from 'tamagui';
import { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { signupSchema } from '../validationSchemas';
import { createAuthUser, createUserDocument } from '../services/auth';
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
} from '../components/auth/styled';

type SignupFormData = z.infer<typeof signupSchema>;

type FieldErrors<T extends FieldValues = SignupFormData> = Partial<
  FieldValues extends IsAny<FieldValues> ? any : FieldErrorsImpl<DeepRequired<T>>
> & {
  root?: Record<string, GlobalError> & GlobalError;
};

const SignupScreen = () => {
  const [playAnimations, setPlayAnimations] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const { control, handleSubmit, reset } = useForm<SignupFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    const { username, email, password } = data;

    setErrors({});

    try {
      const user = await createAuthUser(email, password);
      if (user) {
        await createUserDocument(user, username);
        reset();
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.log('user creation encountered an error', (error as Error).message);
    }
  };

  const onError: SubmitErrorHandler<SignupFormData> = (errors) => {
    setErrors(errors);
  };

  useEffect(() => {
    if (playAnimations) {
      setTimeout(() => {
        setPlayAnimations(false);
      }, 2100);
    }
  }, [playAnimations]);

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
              onPress={handleSubmit(onSubmit, onError)}
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

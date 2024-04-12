import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { z } from 'zod';
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
import { Text, View, styled, useWindowDimensions } from 'tamagui';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { signinSchema } from '../validationSchemas';
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
import { zodResolver } from '@hookform/resolvers/zod';

type SigninFormData = z.infer<typeof signinSchema>;

type FieldErrors<T extends FieldValues = SigninFormData> = Partial<
  FieldValues extends IsAny<FieldValues> ? any : FieldErrorsImpl<DeepRequired<T>>
> & {
  root?: Record<string, GlobalError> & GlobalError;
};

const SigninScreen = () => {
  const [playAnimations, setPlayAnimations] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<SigninFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signinSchema),
  });

  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
    setErrors({});
    console.log({ data });
  };

  const onError: SubmitErrorHandler<SigninFormData> = (errors) => {
    setErrors(errors);
  };

  useEffect(() => {
    if (playAnimations) {
      setTimeout(() => {
        setPlayAnimations(false);
      }, 2100);
    }
  }, [playAnimations]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

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
              onPress={handleSubmit(onSubmit, onError)}
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

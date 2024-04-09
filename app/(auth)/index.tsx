import { TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, Text, View, styled, useWindowDimensions } from 'tamagui';

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

  // const TitleContainer = styled(View, {
  //   alignItems: 'center',
  // });

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

  return (
    <Container>
      <BackgroundImage source={require('@/assets/images/background.png')} />
      <LightsContainer>
        <LargeLight source={require('@/assets/images/light.png')} />
        <SmallLight source={require('@/assets/images/light.png')} />
      </LightsContainer>
      <FormContainer>
        {/* <TitleContainer> */}
        <Title>Login</Title>
        {/* </TitleContainer> */}
        <InputsContainer>
          <InputContainer>
            <TextInput placeholder="Email" placeholderTextColor="gray" />
          </InputContainer>
          <InputContainer>
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
            />
          </InputContainer>
          <SubmitButton>
            <ButtonText>Login</ButtonText>
          </SubmitButton>
          <SignupContainer>
            <Text color="black">Don't have an acount? </Text>
            <TouchableOpacity>
              <Text color="#2892c7">Sign up</Text>
            </TouchableOpacity>
          </SignupContainer>
        </InputsContainer>
      </FormContainer>
      <StatusBar style="light" />
    </Container>
  );
};

export default SigninScreen;

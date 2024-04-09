import { View, Text, styled } from 'tamagui';

const HomeScreen = () => {
  const Container = styled(View, {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  });
  return (
    <Container>
      <Text>Home Screen</Text>
    </Container>
  );
};

export default HomeScreen;

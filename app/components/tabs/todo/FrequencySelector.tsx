import {} from 'react-native';
import { styled, View, Text } from 'tamagui';

const FrequencySelector = () => {
  return (
    <Container>
      <Text>FrequencySelector</Text>
    </Container>
  );
};

const Container = styled(View, {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 160,
  padding: 16,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  backgroundColor: 'red',
});

export default FrequencySelector;

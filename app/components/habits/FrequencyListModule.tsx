import { styled, View, Text } from 'tamagui';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const FrequencyListModule = () => {
  return (
    <Container>
      <Text>FrequencyListModule</Text>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
});

export default FrequencyListModule;

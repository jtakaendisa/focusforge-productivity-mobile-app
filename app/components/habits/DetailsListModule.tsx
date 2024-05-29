import { styled, View, Text } from 'tamagui';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const DetailsListModule = () => {
  return (
    <Container>
      <Text>DetailsListModule</Text>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
});

export default DetailsListModule;

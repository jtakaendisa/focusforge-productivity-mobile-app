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
  borderWidth: 1,
  borderColor: 'green',
});

export default DetailsListModule;

import { View, Text, styled } from 'tamagui';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const DurationListModule = () => {
  return (
    <Container>
      <Text>DueDateListModule</Text>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
  borderWidth: 1,
  borderColor: 'orange',
});

export default DurationListModule;

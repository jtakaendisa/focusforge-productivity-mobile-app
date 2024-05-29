import { View, Text, styled } from 'tamagui';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';

const CategoryListModule = () => {
  return (
    <Container>
      <Text>CategoryListModule</Text>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
  borderWidth: 1,
  borderColor: 'red',
});

export default CategoryListModule;

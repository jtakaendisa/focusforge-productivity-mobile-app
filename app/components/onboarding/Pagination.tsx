import { SharedValue } from 'react-native-reanimated';
import { styled, View } from 'tamagui';

import { OnboardingData } from '@/data';
import Dot from './Dot';

interface Props {
  data: OnboardingData[];
  x: SharedValue<number>;
}

const Pagination = ({ data, x }: Props) => {
  return (
    <Container>
      {data.map((_, index) => (
        <Dot key={index} index={index} x={x} />
      ))}
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
});

export default Pagination;

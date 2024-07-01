import { useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text } from 'tamagui';

import { ChecklistItem as ChecklistItemType } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import SquareCheckbox from '../SquareCheckbox';

interface Props {
  listItem: ChecklistItemType;
  onCheck: (id: string) => void;
}

const CheckableChecklistItem = ({ listItem, onCheck }: Props) => {
  const { id, title, isCompleted } = listItem;

  const isChecked = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    isChecked.value = isCompleted ? withTiming(1) : withTiming(0);
  }, [isCompleted]);

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut} onPress={() => onCheck(id)}>
      <SquareCheckbox isChecked={isChecked} />
      <Title>{toTruncatedText(title, 65)}</Title>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  height: 46,
  paddingLeft: 12,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const Title = styled(Text, {
  fontSize: 16,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default CheckableChecklistItem;

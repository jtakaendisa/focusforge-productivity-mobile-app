import { useEffect } from 'react';
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
import RippleButton from '../RippleButton';

interface Props {
  listItem: ChecklistItemType;
  isLastIndex?: boolean;
  onCheck: (id: string) => void;
}

const CheckableChecklistItem = ({ listItem, isLastIndex, onCheck }: Props) => {
  const { id, title, isCompleted } = listItem;

  const isChecked = useSharedValue(isCompleted ? 1 : 0);

  const handleCheckItem = () => onCheck(id);

  useEffect(() => {
    isChecked.value = isCompleted ? withTiming(1) : withTiming(0);
  }, [isCompleted]);

  return (
    <RippleButton onPress={handleCheckItem}>
      <AnimatedContainer isBordered={!isLastIndex} entering={FadeIn} exiting={FadeOut}>
        <SquareCheckbox isChecked={isChecked} />
        <Title>{toTruncatedText(title, 65)}</Title>
      </AnimatedContainer>
    </RippleButton>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  height: 46,
  paddingLeft: 12,
  borderBottomWidth: 1,
  variants: {
    isBordered: {
      true: {
        borderColor: '$customGray2',
      },
      false: {
        borderColor: 'transparent',
      },
    },
  } as const,
});

const Title = styled(Text, {
  fontSize: 16,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default CheckableChecklistItem;

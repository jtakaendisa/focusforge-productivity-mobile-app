import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';

import { ChecklistItem as ChecklistItemType } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { toTruncatedText } from '@/app/utils';
import BinSvg from '../../icons/BinSvg';
import RippleButton from '../RippleButton';

interface Props {
  listItem: ChecklistItemType;
  isLastIndex?: boolean;
  onDelete: (id: string) => void;
}

const ChecklistItem = ({ listItem, isLastIndex, onDelete }: Props) => {
  const { id, title } = listItem;

  const { customRed1 } = useCustomColors();

  const handleDeleteItem = () => onDelete(id);

  return (
    <AnimatedContainer isBordered={!isLastIndex} entering={FadeIn} exiting={FadeOut}>
      <Title>{toTruncatedText(title, 65)}</Title>
      <RippleButton onPress={handleDeleteItem}>
        <IconContainer>
          <BinSvg size={18} fill={customRed1} />
        </IconContainer>
      </RippleButton>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
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

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 42,
  height: '100%',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ChecklistItem;

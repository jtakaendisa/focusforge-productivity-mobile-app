import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { getTokenValue, styled, Text, View } from 'tamagui';

import { ChecklistItem as ChecklistItemType } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import BinSvg from '../../icons/BinSvg';

interface Props {
  listItem: ChecklistItemType;
  onDelete: (id: string) => void;
}

const ChecklistItem = ({ listItem, onDelete }: Props) => {
  const { id, title } = listItem;

  const customRed1 = getTokenValue('$customRed1');

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
      <Title>{toTruncatedText(title, 65)}</Title>
      <IconContainer onPress={() => onDelete(id)}>
        <BinSvg size={18} fill={customRed1} />
      </IconContainer>
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
  borderColor: '$customGray2',
});

const Title = styled(Text, {
  fontSize: 16,
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 42,
  height: 32,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ChecklistItem;

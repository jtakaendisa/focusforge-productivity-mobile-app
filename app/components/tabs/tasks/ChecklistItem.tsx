import Svg, { Path } from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { ChecklistItem as ChecklistItemType } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';

interface Props {
  listItem: ChecklistItemType;
  onDelete: (id: string) => void;
}

const SVG_SIZE = 18;

const ChecklistItem = ({ listItem, onDelete }: Props) => {
  const { id, title } = listItem;

  const customRed1 = getTokenValue('$customRed1');

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
      <Title>{toTruncatedText(title, 65)}</Title>
      <IconContainer onPress={() => onDelete(id)}>
        <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 21 24" fill="none">
          <Path
            d="M7.67813 0H13.3219C13.8891 0 14.4094 0.31875 14.6625 0.829688L15 1.5H19.5C20.3297 1.5 21 2.17031 21 3C21 3.82969 20.3297 4.5 19.5 4.5H1.5C0.670312 4.5 0 3.82969 0 3C0 2.17031 0.670312 1.5 1.5 1.5H6L6.3375 0.829688C6.59062 0.31875 7.11094 0 7.67813 0ZM1.5 6H19.5L18.5062 21.8906C18.4312 23.0766 17.4469 24 16.2609 24H4.73906C3.55312 24 2.56875 23.0766 2.49375 21.8906L1.5 6ZM6.70312 11.2031C6.2625 11.6437 6.2625 12.3562 6.70312 12.7922L8.90625 14.9953L6.70312 17.1984C6.2625 17.6391 6.2625 18.3516 6.70312 18.7875C7.14375 19.2234 7.85625 19.2281 8.29219 18.7875L10.4953 16.5844L12.6984 18.7875C13.1391 19.2281 13.8516 19.2281 14.2875 18.7875C14.7234 18.3469 14.7281 17.6344 14.2875 17.1984L12.0844 14.9953L14.2875 12.7922C14.7281 12.3516 14.7281 11.6391 14.2875 11.2031C13.8469 10.7672 13.1344 10.7625 12.6984 11.2031L10.4953 13.4062L8.29219 11.2031C7.85156 10.7625 7.13906 10.7625 6.70312 11.2031Z"
            fill={customRed1}
          />
        </Svg>
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

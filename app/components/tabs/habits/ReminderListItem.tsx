import { Reminder } from '@/app/entities';
import { toFormattedTimeString } from '@/app/utils';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { getTokenValue, styled, Text, View } from 'tamagui';
import AlarmClockSvg from '../../icons/AlarmClockSvg';
import BellSvg from '../../icons/BellSvg';
import BinSvg from '../../icons/BinSvg';
import RippleButton from '../RippleButton';

interface Props {
  listItem: Reminder;
  isLastIndex: boolean;
  onDelete: (id: string) => void;
}

const ReminderListItem = ({ listItem, isLastIndex, onDelete }: Props) => {
  const { id, time, type } = listItem;

  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  const handleDeleteReminder = () => onDelete(id);

  return (
    <AnimatedContainer isBordered={!isLastIndex} entering={FadeIn} exiting={FadeOut}>
      <IconContainer>
        {type === 'notification' ? (
          <BellSvg size={18} fill={customGray1} />
        ) : (
          <AlarmClockSvg size={18} fill={customGray1} />
        )}
      </IconContainer>
      <Title>{toFormattedTimeString(time)}</Title>
      <RippleButton onPress={handleDeleteReminder}>
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
  width: '100%',
  height: 46,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
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
  fontWeight: 'bold',
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 42,
  height: '100%',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ReminderListItem;

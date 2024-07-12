import { ActivityFilter } from '@/app/entities';
import { styled, View, Text } from 'tamagui';
import RippleButton from '../RippleButton';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

interface Props {
  offsetTop: number;
  width: number;
  onSelect: (activityFilter: ActivityFilter) => void;
}

const options: ActivityFilter[] = ['all', 'habits', 'tasks'];

const ActivityFilterModalModule = ({ offsetTop, width, onSelect }: Props) => {
  return (
    <AnimatedContainer
      entering={FadeInUp}
      exiting={FadeOutDown}
      top={offsetTop}
      width={width}
    >
      {options.map((option) => (
        <RippleButton key={option} onPress={() => onSelect(option)}>
          <OptionContainer>
            <OptionText>{option}</OptionText>
          </OptionContainer>
        </RippleButton>
      ))}
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  position: 'absolute',
  left: 0,
  backgroundColor: '$customBlack1',
});

const OptionContainer = styled(View, {
  height: 46,
  justifyContent: 'center',
  paddingLeft: 12,
});

const OptionText = styled(Text, {
  fontSize: 16,
  textTransform: 'capitalize',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ActivityFilterModalModule;

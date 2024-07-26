import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Text, View, Image, styled } from 'tamagui';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/app/constants';

const ActivityListPlaceholder = () => {
  return (
    <AnimatedContainer entering={FadeInDown} exiting={FadeOutUp}>
      <Image
        source={{
          uri: require('@/assets/images/placeholder.png'),
          width: SCREEN_WIDTH / 2,
          height: SCREEN_HEIGHT / 4.4,
        }}
      />
      <TextContainer>
        <Heading>There is nothing scheduled</Heading>
        <SubText>Try adding new activities</SubText>
      </TextContainer>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  gap: 36,
  alignItems: 'center',
  marginTop: -SCREEN_HEIGHT / 15,
});

const TextContainer = styled(View, {
  alignItems: 'center',
  gap: 6,
});

const Heading = styled(Text, {
  fontSize: 17,
  color: 'white',
});

const SubText = styled(Text, {
  fontSize: 14.5,
  color: '$customGray1',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ActivityListPlaceholder;

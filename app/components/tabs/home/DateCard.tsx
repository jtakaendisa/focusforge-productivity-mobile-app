import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text, getTokens } from 'tamagui';

interface Props {
  item: {
    weekday: string;
    date: Date;
  };
  selectedDate: Date;
  onPress: (date: Date) => void;
}

const DateCard = ({ item, selectedDate, onPress }: Props) => {
  const isSelected = useSharedValue(false);

  const white = getTokens().color.$white.val;
  const textGray = getTokens().color.$gray1.val;
  const lightGray = getTokens().color.$gray2.val;
  const darkGray = getTokens().color.$gray3.val;
  const lightRed = getTokens().color.$red1.val;
  const darkRed = getTokens().color.$red3.val;

  // const handleLayout = (event: LayoutChangeEvent) => {
  //   const width = event.nativeEvent.layout.width;
  //   itemWidth = width;
  // };

  const textColorAnimation = useAnimatedStyle(() => ({
    color: isSelected.value ? withTiming(white) : withTiming(textGray),
  }));

  const weekdayBackgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: isSelected.value ? withTiming(lightRed) : withTiming(darkGray),
  }));

  const dateBackgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: isSelected.value ? withTiming(darkRed) : withTiming(lightGray),
  }));

  useEffect(() => {
    isSelected.value = selectedDate.toDateString() === item.date.toDateString();
  }, [item.date, selectedDate]);

  return (
    <Container onPress={() => onPress(item.date)}>
      <AnimatedWeekdayContainer style={weekdayBackgroundAnimation}>
        <AnimatedWeekdayText style={textColorAnimation}>
          {item.weekday}
        </AnimatedWeekdayText>
      </AnimatedWeekdayContainer>
      <AnimatedDateContainer style={dateBackgroundAnimation}>
        <AnimatedDateText style={textColorAnimation}>
          {item.date.getDate()}
        </AnimatedDateText>
      </AnimatedDateContainer>
    </Container>
  );
};

const Container = styled(View, {
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  width: 50,
  height: 66,
  borderRadius: 18,
  overflow: 'hidden',
});

const WeekdayContainer = styled(View, {
  position: 'absolute',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  paddingTop: 4,
});

const DateContainer = styled(View, {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 0,
  width: '100%',
  height: '64%',
  borderRadius: 18,
});

const WeekdayText = styled(Text, {
  fontSize: 11.5,
});

const DateText = styled(Text, {
  fontSize: 16,
});

const AnimatedWeekdayContainer = Animated.createAnimatedComponent(WeekdayContainer);
const AnimatedDateContainer = Animated.createAnimatedComponent(DateContainer);
const AnimatedWeekdayText = Animated.createAnimatedComponent(WeekdayText);
const AnimatedDateText = Animated.createAnimatedComponent(DateText);

export default DateCard;

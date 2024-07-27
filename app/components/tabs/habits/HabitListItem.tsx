import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { MutableRefObject, useMemo, useRef } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';

import { CURRENT_DATE } from '@/app/constants';
import { Activity } from '@/app/entities';
import { HabitActiveTab } from '@/app/habitDetails';
import { toTruncatedText } from '@/app/utils';
import { Swipeable } from 'react-native-gesture-handler';
import BarChartSvg from '../../icons/BarChartSvg';
import CalendarSvg from '../../icons/CalendarSvg';
import CheckCircleSvg from '../../icons/CheckCircleSvg';
import EllipsisVerticalSvg from '../../icons/EllipsisVerticalSvg';
import LinkSvg from '../../icons/LinkSvg';
import CategoryIcon from '../CategoryIcon';
import FrequencyBadge from './FrequencyBadge';
import HabitDateCard from './HabitDateCard';
import HabitItemLeftActions from './HabitItemLeftActions';
import HabitItemRightActions from './HabitItemRightActions';

interface Props {
  habit: Activity;
  showOptions: (habit: Activity) => void;
  onNavigate: (activeTab: HabitActiveTab, habitId: string) => void;
  onSwipe: (
    direction: 'left' | 'right',
    habit: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => void;
  openModal: () => void;
}

const SVG_SIZE = 18;

const HabitListItem = ({ habit, showOptions, onNavigate, onSwipe }: Props) => {
  const { id, title, category, frequency, endDate } = habit;

  const swipeableRef = useRef<Swipeable | null>(null);

  const days = useMemo(() => {
    const daysOfWeek = eachDayOfInterval({
      start: startOfWeek(CURRENT_DATE, { weekStartsOn: 0 }), // Week starts on Sunday
      end: endOfWeek(CURRENT_DATE, { weekStartsOn: 0 }), // Week ends on Saturday
    });

    const dayObjects = daysOfWeek.map((day) => ({
      weekday: format(day, 'eee'),
      date: day.getDate(),
    }));

    return dayObjects;
  }, [CURRENT_DATE, endDate]);

  const handleSwipe = (direction: 'left' | 'right') =>
    onSwipe(direction, habit, swipeableRef);

  const customBlack1 = getTokenValue('$customBlack1');
  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={(_, dragAnimatedValue) => (
          <HabitItemLeftActions dragAnimatedValue={dragAnimatedValue} />
        )}
        renderRightActions={(_, dragAnimatedValue) => (
          <HabitItemRightActions dragAnimatedValue={dragAnimatedValue} />
        )}
        onSwipeableOpen={handleSwipe}
      >
        <HabitContainer>
          <DetailsRow>
            <TitleContainer>
              <Title>{toTruncatedText(title, 38)}</Title>
              <FrequencyBadge frequency={frequency!} />
            </TitleContainer>
            <CategoryContainer>
              <CategoryIcon category={category} fill={customBlack1} />
            </CategoryContainer>
          </DetailsRow>
          <CalendarRow>
            {days.map((day) => (
              <HabitDateCard key={day.date} day={day} />
            ))}
          </CalendarRow>
          <BottomRow>
            <StatsContainer>
              <Stat>
                <LinkSvg size={SVG_SIZE} fill={customRed1} />
                <StatText>0</StatText>
              </Stat>
              <Stat>
                <CheckCircleSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
                <StatText>15%</StatText>
              </Stat>
            </StatsContainer>
            <ActionsContainer>
              <ActionButton onPress={() => onNavigate('calendar', id)}>
                <CalendarSvg size={SVG_SIZE} fill={customGray1} />
              </ActionButton>
              <ActionButton onPress={() => onNavigate('statistics', id)}>
                <BarChartSvg size={SVG_SIZE} fill={customGray1} />
              </ActionButton>
              <ActionButton onPress={() => showOptions(habit)}>
                <EllipsisVerticalSvg size={SVG_SIZE} fill={customGray1} />
              </ActionButton>
            </ActionsContainer>
          </BottomRow>
        </HabitContainer>
      </Swipeable>
    </AnimatedContainer>
  );
};

const HabitContainer = styled(View, {
  height: 180,
  backgroundColor: '$customGray3',
  borderRadius: 20,
});

const DetailsRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingTop: 10,
});

const TitleContainer = styled(View, {
  gap: 4,
});

const Title = styled(Text, {
  fontSize: 16,
  fontWeight: 'bold',
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: 'gray',
  borderRadius: 8,
});

const CalendarRow = styled(View, {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const BottomRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 44,
  paddingHorizontal: 12,
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const StatsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const Stat = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
});

const StatText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

const ActionsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const ActionButton = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 28,
  height: 28,
});

const AnimatedContainer = Animated.createAnimatedComponent(View);

export default HabitListItem;

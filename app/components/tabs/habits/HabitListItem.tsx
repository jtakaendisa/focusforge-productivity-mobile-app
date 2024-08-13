import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { MutableRefObject, useMemo, useRef } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';

import { Activity, CompletionDate, HabitActiveTab } from '@/app/entities';
import { calculateStreaks, toFormattedDateString, toTruncatedText } from '@/app/utils';
import { Swipeable } from 'react-native-gesture-handler';
import BarChartSvg from '../../icons/BarChartSvg';
import CalendarSvg from '../../icons/CalendarSvg';
import CheckCircleSvg from '../../icons/CheckCircleSvg';
import EllipsisVerticalSvg from '../../icons/EllipsisVerticalSvg';
import LinkSvg from '../../icons/LinkSvg';
import CategoryIcon from '../CategoryIcon';
import RippleButton from '../RippleButton';
import FrequencyBadge from './FrequencyBadge';
import HabitDateCard from './HabitDateCard';
import HabitItemLeftActions from './HabitItemLeftActions';
import HabitItemRightActions from './HabitItemRightActions';

interface Props {
  habit: Activity;
  completionDates: CompletionDate[];
  onShowOptions: (habit: Activity) => void;
  onNavigate: (activeTab: HabitActiveTab, habitId: string) => void;
  onSwipe: (
    direction: 'left' | 'right',
    habit: Activity,
    swipeableRef: MutableRefObject<Swipeable | null>
  ) => void;
  onComplete: (id: string, updatedCompletionDates: CompletionDate[]) => void;
}

const SVG_SIZE = 18;

const HabitListItem = ({
  habit,
  completionDates,
  onShowOptions,
  onNavigate,
  onSwipe,
  onComplete,
}: Props) => {
  const { id, title, category, frequency } = habit;

  const swipeableRef = useRef<Swipeable | null>(null);

  const days = useMemo(() => {
    const currentDate = new Date();

    const daysOfWeek = eachDayOfInterval({
      start: startOfWeek(currentDate, { weekStartsOn: 1 }),
      end: endOfWeek(currentDate, { weekStartsOn: 1 }),
    });

    const dayObjects = daysOfWeek.map((day) => ({
      weekday: format(day, 'eee'),
      date: day.getDate(),
      originalDay: day,
      isPressable: !!completionDates.find(
        (cd) => cd.date === toFormattedDateString(day)
      ),
      isCompleted: !!completionDates.find(
        (cd) => cd.date === toFormattedDateString(day)
      )?.isCompleted,
    }));

    return dayObjects;
  }, [completionDates]);

  const { currentStreak, completionPercentage } = useMemo(() => {
    const { currentStreak } = calculateStreaks(completionDates);

    const daysCompleted = completionDates.reduce(
      (total, entry) => (entry.isCompleted ? total + 1 : total),
      0
    );
    const totalDays = completionDates.length;
    const completionPercentage = Math.round((daysCompleted / totalDays) * 100);

    return { currentStreak, completionPercentage };
  }, [completionDates]);

  const handleSwipe = (direction: 'left' | 'right') =>
    onSwipe(direction, habit, swipeableRef);

  const handleComplete = (selectedDate: Date) => {
    const updatedCompletionDates = completionDates.map((cd) =>
      cd.date === toFormattedDateString(selectedDate)
        ? { ...cd, isCompleted: !cd.isCompleted }
        : cd
    );
    onComplete(id, updatedCompletionDates);
  };

  const handleNavigateToCalendarTab = () => onNavigate('calendar', id);

  const handleNavigateToStatisticsTab = () => onNavigate('statistics', id);

  const handleShowOptions = () => onShowOptions(habit);

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
              <HabitDateCard key={day.date} day={day} onComplete={handleComplete} />
            ))}
          </CalendarRow>
          <BottomRow>
            <StatsContainer>
              <Stat>
                <LinkSvg size={SVG_SIZE} fill={customRed1} />
                <StatText>{currentStreak}</StatText>
              </Stat>
              <Stat>
                <CheckCircleSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
                <StatText>{completionPercentage}%</StatText>
              </Stat>
            </StatsContainer>
            <ActionsContainer>
              <RippleButton fade onPress={handleNavigateToCalendarTab}>
                <ActionButton>
                  <CalendarSvg size={SVG_SIZE} fill={customGray1} />
                </ActionButton>
              </RippleButton>
              <RippleButton fade onPress={handleNavigateToStatisticsTab}>
                <ActionButton>
                  <BarChartSvg size={SVG_SIZE} fill={customGray1} />
                </ActionButton>
              </RippleButton>
              <RippleButton fade onPress={handleShowOptions}>
                <ActionButton>
                  <EllipsisVerticalSvg size={SVG_SIZE} fill={customGray1} />
                </ActionButton>
              </RippleButton>
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
});

const ActionButton = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: '100%',
});

const AnimatedContainer = Animated.createAnimatedComponent(View);

export default HabitListItem;

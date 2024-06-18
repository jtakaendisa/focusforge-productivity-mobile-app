import { useMemo } from 'react';
import { eachDayOfInterval, format } from 'date-fns';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { View, Text, styled } from 'tamagui';

import { Habit } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import CategoryIcon from '../tabs/CategoryIcon';
import FrequencyBadge from './FrequencyBadge';
import HabitDateCard from './HabitDateCard';

interface Props {
  habit: Habit;
  showOptions: (habit: Habit) => void;
  onNavigate: (activeTab: string, habitId: string) => void;
}

const SVG_SIZE = 18;

const HabitListItem = ({ habit, showOptions, onNavigate }: Props) => {
  const { id, title, category, frequency, startDate, endDate } = habit;

  const days = useMemo(() => {
    const defaultEndDate = new Date(startDate);
    defaultEndDate.setDate(startDate.getDate() + 6);

    const daysOfWeek = eachDayOfInterval({
      start: startDate,
      end: endDate || defaultEndDate,
    });

    const dayObjects = daysOfWeek.map((day) => ({
      weekday: format(day, 'eee'),
      date: day.getDate(),
    }));

    return dayObjects;
  }, [startDate, endDate]);

  return (
    <AnimatedContainer entering={FadeIn} exiting={FadeOut}>
      <DetailsRow>
        <TitleContainer>
          <Title>{toTruncatedText(title, 38)}</Title>
          <FrequencyBadge frequency={frequency} />
        </TitleContainer>
        <CategoryContainer>
          <CategoryIcon category={category} />
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
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 26 20" fill="none">
              <Path
                d="M24.0109 10.4792C26.4088 8.08135 26.4088 4.19439 24.0109 1.7965C21.7282 -0.486187 18.0631 -0.609922 15.6311 1.51916L15.3708 1.74957C14.9441 2.12077 14.9015 2.76931 15.2727 3.19598C15.6439 3.62265 16.2924 3.66532 16.7191 3.29411L16.9793 3.06371C18.6007 1.64716 21.0413 1.72823 22.5645 3.25145C24.1602 4.84719 24.1602 7.43708 22.5645 9.0371L17.7303 13.867C16.1345 15.4628 13.5404 15.4628 11.9446 13.867C10.4214 12.3438 10.3404 9.90324 11.7569 8.28189L11.9574 8.05149C12.3286 7.62482 12.286 6.98054 11.8593 6.60507C11.4326 6.2296 10.7884 6.27654 10.4129 6.70321L10.2124 6.93361C8.08754 9.36563 8.21127 13.0307 10.494 15.3134C12.8918 17.7113 16.7788 17.7113 19.1767 15.3134L24.0109 10.4792ZM1.79842 9.5235C-0.599472 11.9214 -0.599472 15.8084 1.79842 18.202C4.08537 20.4889 7.75047 20.6084 10.1825 18.4793L10.4428 18.2489C10.8694 17.8777 10.9121 17.2292 10.5409 16.8025C10.1697 16.3758 9.52115 16.3332 9.09448 16.7044L8.83421 16.9348C7.21286 18.3513 4.77231 18.2702 3.24909 16.747C1.65335 15.1513 1.65335 12.5614 3.24909 10.9614L8.08327 6.13574C9.67902 4.53999 12.2689 4.53999 13.8689 6.13574C15.3921 7.65895 15.4732 10.0995 14.0567 11.7209L13.8263 11.9811C13.4551 12.4078 13.4977 13.0521 13.9244 13.4275C14.3511 13.803 14.9953 13.7561 15.3708 13.3294L15.6012 13.0691C17.7303 10.6371 17.6066 6.97201 15.3239 4.68506C12.926 2.28717 9.03901 2.28717 6.64112 4.68506L1.79842 9.5235Z"
                fill="#C73A57"
              />
            </Svg>
            <StatText>0</StatText>
          </Stat>
          <Stat>
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
              <Path
                d="M10 1.25C12.3206 1.25 14.5462 2.17187 16.1872 3.81282C17.8281 5.45376 18.75 7.67936 18.75 10C18.75 12.3206 17.8281 14.5462 16.1872 16.1872C14.5462 17.8281 12.3206 18.75 10 18.75C7.67936 18.75 5.45376 17.8281 3.81282 16.1872C2.17187 14.5462 1.25 12.3206 1.25 10C1.25 7.67936 2.17187 5.45376 3.81282 3.81282C5.45376 2.17187 7.67936 1.25 10 1.25ZM10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM14.1914 7.94141C14.4336 7.69922 14.4336 7.30078 14.1914 7.05859C13.9492 6.81641 13.5508 6.81641 13.3086 7.05859L8.75 11.6172L6.69141 9.55859C6.44922 9.31641 6.05078 9.31641 5.80859 9.55859C5.56641 9.80078 5.56641 10.1992 5.80859 10.4414L8.30859 12.9414C8.55078 13.1836 8.94922 13.1836 9.19141 12.9414L14.1914 7.94141Z"
                fill="#C73A57"
              />
            </Svg>
            <StatText>15%</StatText>
          </Stat>
        </StatsContainer>
        <ActionsContainer>
          <ActionButton onPress={() => onNavigate('calendar', id)}>
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 19 20" fill="none">
              <Path
                d="M17.1367 1.41797H15.7188V3.57422C15.7188 3.97656 15.4102 4.28125 15.0117 4.28125H12.1445C11.7422 4.28125 11.4375 3.97266 11.4375 3.57422V1.41797H7.12109V3.57422C7.12109 3.97656 6.8125 4.28125 6.41406 4.28125H3.54688C3.14453 4.28125 2.83984 3.97266 2.83984 3.57422V1.41797H1.41797C0.617188 1.41797 0 2.06641 0 2.83594V18.582C0 19.3828 0.648438 20 1.41797 20H17.1641C17.9648 20 18.582 19.3516 18.582 18.582V2.86719C18.5859 2.06641 17.9375 1.41797 17.1367 1.41797ZM17.1367 18.6133H1.41797V5.73047H17.1641V18.6133H17.1367ZM5.70312 2.86719H4.28516V0H5.70312V2.86719ZM14.3008 2.86719H12.8828V0H14.3008V2.86719ZM7.12109 8.59766H5.70312V7.17969H7.12109V8.59766ZM9.98828 8.59766H8.57031V7.17969H9.98828V8.59766ZM12.8516 8.59766H11.4336V7.17969H12.8516V8.59766ZM15.7188 8.59766H14.3008V7.17969H15.7188V8.59766ZM4.28516 11.4336H2.86719V10.0156H4.28516V11.4336ZM7.12109 11.4336H5.70312V10.0156H7.12109V11.4336ZM9.98828 11.4336H8.57031V10.0156H9.98828V11.4336ZM12.8516 11.4336H11.4336V10.0156H12.8516V11.4336ZM15.7188 11.4336H14.3008V10.0156H15.7188V11.4336ZM4.28516 14.3008H2.86719V12.8828H4.28516V14.3008ZM7.12109 14.3008H5.70312V12.8828H7.12109V14.3008ZM9.98828 14.3008H8.57031V12.8828H9.98828V14.3008ZM12.8516 14.3008H11.4336V12.8828H12.8516V14.3008ZM15.7188 14.3008H14.3008V12.8828H15.7188V14.3008ZM4.28516 17.1641H2.86719V15.7461H4.28516V17.1641ZM7.12109 17.1641H5.70312V15.7461H7.12109V17.1641ZM9.98828 17.1641H8.57031V15.7461H9.98828V17.1641ZM12.8516 17.1641H11.4336V15.7461H12.8516V17.1641Z"
                fill="#8C8C8C"
              />
            </Svg>
          </ActionButton>
          <ActionButton onPress={() => onNavigate('statistics', id)}>
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
              <Path
                d="M10.7143 1.42857C11.1071 1.42857 11.4286 1.75 11.4286 2.14286V17.8571C11.4286 18.25 11.1071 18.5714 10.7143 18.5714H9.28571C8.89286 18.5714 8.57143 18.25 8.57143 17.8571V2.14286C8.57143 1.75 8.89286 1.42857 9.28571 1.42857H10.7143ZM9.28571 0C8.10268 0 7.14286 0.959821 7.14286 2.14286V17.8571C7.14286 19.0402 8.10268 20 9.28571 20H10.7143C11.8973 20 12.8571 19.0402 12.8571 17.8571V2.14286C12.8571 0.959821 11.8973 0 10.7143 0H9.28571ZM3.57143 10C3.96429 10 4.28571 10.3214 4.28571 10.7143V17.8571C4.28571 18.25 3.96429 18.5714 3.57143 18.5714H2.14286C1.75 18.5714 1.42857 18.25 1.42857 17.8571V10.7143C1.42857 10.3214 1.75 10 2.14286 10H3.57143ZM2.14286 8.57143C0.959821 8.57143 0 9.53125 0 10.7143V17.8571C0 19.0402 0.959821 20 2.14286 20H3.57143C4.75446 20 5.71429 19.0402 5.71429 17.8571V10.7143C5.71429 9.53125 4.75446 8.57143 3.57143 8.57143H2.14286ZM16.4286 4.28571H17.8571C18.25 4.28571 18.5714 4.60714 18.5714 5V17.8571C18.5714 18.25 18.25 18.5714 17.8571 18.5714H16.4286C16.0357 18.5714 15.7143 18.25 15.7143 17.8571V5C15.7143 4.60714 16.0357 4.28571 16.4286 4.28571ZM14.2857 5V17.8571C14.2857 19.0402 15.2455 20 16.4286 20H17.8571C19.0402 20 20 19.0402 20 17.8571V5C20 3.81696 19.0402 2.85714 17.8571 2.85714H16.4286C15.2455 2.85714 14.2857 3.81696 14.2857 5Z"
                fill="#8C8C8C"
              />
            </Svg>
          </ActionButton>
          <ActionButton onPress={() => showOptions(habit)}>
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 6 20" fill="none">
              <Path
                d="M2.59259 14.8148C1.90499 14.8148 1.24556 15.088 0.759353 15.5742C0.273147 16.0604 0 16.7198 0 17.4074C0 18.095 0.273147 18.7544 0.759353 19.2406C1.24556 19.7269 1.90499 20 2.59259 20C3.28019 20 3.93963 19.7269 4.42583 19.2406C4.91204 18.7544 5.18519 18.095 5.18519 17.4074C5.18519 16.7198 4.91204 16.0604 4.42583 15.5742C3.93963 15.088 3.28019 14.8148 2.59259 14.8148ZM2.59259 7.40741C1.90499 7.40741 1.24556 7.68055 0.759353 8.16676C0.273147 8.65297 0 9.3124 0 10C0 10.6876 0.273147 11.347 0.759353 11.8332C1.24556 12.3194 1.90499 12.5926 2.59259 12.5926C3.28019 12.5926 3.93963 12.3194 4.42583 11.8332C4.91204 11.347 5.18519 10.6876 5.18519 10C5.18519 9.3124 4.91204 8.65297 4.42583 8.16676C3.93963 7.68055 3.28019 7.40741 2.59259 7.40741ZM5.18519 2.59259C5.18519 1.90499 4.91204 1.24556 4.42583 0.759353C3.93963 0.273147 3.28019 0 2.59259 0C1.90499 0 1.24556 0.273147 0.759353 0.759353C0.273147 1.24556 0 1.90499 0 2.59259C0 3.28019 0.273147 3.93963 0.759353 4.42583C1.24556 4.91204 1.90499 5.18519 2.59259 5.18519C3.28019 5.18519 3.93963 4.91204 4.42583 4.42583C4.91204 3.93963 5.18519 3.28019 5.18519 2.59259Z"
                fill="#8C8C8C"
              />
            </Svg>
          </ActionButton>
        </ActionsContainer>
      </BottomRow>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  height: 180,
  backgroundColor: '#1C1C1C',
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
  borderColor: '#262626',
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

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default HabitListItem;

import { getTokenValue, ScrollView, styled, Text, View } from 'tamagui';

import { Activity, CompletionDate } from '@/app/entities';
import ActivityInfoPanel from '../ActivityInfoPanel';
import LinkSvg from '../../icons/LinkSvg';
import MedalSvg from '../../icons/MedalSvg';
import PieChartSvg from '../../icons/PieChartSvg';
import CheckCircleSvg from '../../icons/CheckCircleSvg';
import TrophySvg from '../../icons/TrophySvg';
import StreakInfoPanelModule from './StreakInfoPanelModule';
import CircularProgressBar from './CircularProgressBar';

interface Props {
  completionDates: CompletionDate[];
  currentStreak: number;
  bestStreak: number;
}

const HabitStatistics = ({ completionDates, currentStreak, bestStreak }: Props) => {
  const customRed2 = getTokenValue('$customRed2');

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ActivityInfoPanel
        icon={<TrophySvg fill={customRed2} />}
        title="Habit score"
        isBordered={false}
      >
        <CircularProgressBar completionDates={completionDates} />
      </ActivityInfoPanel>
      <ActivityInfoPanel icon={<LinkSvg fill={customRed2} />} title="Streak">
        <StreakInfoPanelModule currentStreak={currentStreak} bestStreak={bestStreak} />
      </ActivityInfoPanel>
      <ActivityInfoPanel
        icon={<CheckCircleSvg fill={customRed2} variant="outline" />}
        title="Times completed"
      ></ActivityInfoPanel>
      <ActivityInfoPanel></ActivityInfoPanel>
      <ActivityInfoPanel
        icon={<PieChartSvg fill={customRed2} />}
        title="Success / Fail"
      ></ActivityInfoPanel>
      <ActivityInfoPanel
        icon={<MedalSvg fill={customRed2} variant="outline" />}
        title="Streak challenge"
      ></ActivityInfoPanel>
    </ScrollView>
  );
};

export default HabitStatistics;

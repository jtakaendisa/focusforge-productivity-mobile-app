import { getTokenValue, ScrollView } from 'tamagui';

import { CompletionDate } from '@/app/entities';
import CheckCircleSvg from '../../icons/CheckCircleSvg';
import LinkSvg from '../../icons/LinkSvg';
import MedalSvg from '../../icons/MedalSvg';
import PieChartSvg from '../../icons/PieChartSvg';
import TrophySvg from '../../icons/TrophySvg';
import ActivityInfoPanel from '../ActivityInfoPanel';
import CircularProgressBar from './CircularProgressBar';
import CompletionMetricsInfoPanelModule from './CompletionMetricsInfoPanelModule';
import CustomPieChart from './CustomPieChart';
import StreakInfoPanelModule from './StreakInfoPanelModule';

interface Props {
  completionDates: CompletionDate[];
  currentStreak: number;
  bestStreak: number;
}

const HabitStatistics = ({ completionDates, currentStreak, bestStreak }: Props) => {
  const customRed2 = getTokenValue('$customRed2');

  return (
    <ScrollView>
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
      >
        <CompletionMetricsInfoPanelModule completionDates={completionDates} />
      </ActivityInfoPanel>
      <ActivityInfoPanel></ActivityInfoPanel>
      <ActivityInfoPanel
        icon={<PieChartSvg fill={customRed2} />}
        title="Success / Failure"
      >
        <CustomPieChart completionDates={completionDates} />
      </ActivityInfoPanel>
      <ActivityInfoPanel
        icon={<MedalSvg fill={customRed2} variant="outline" />}
        title="Streak challenge"
      ></ActivityInfoPanel>
    </ScrollView>
  );
};

export default HabitStatistics;

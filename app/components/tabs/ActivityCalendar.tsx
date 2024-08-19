import { getTokenValue, styled, Text, View } from 'tamagui';

import { Activity, CompletionDate } from '@/app/entities';
import LinkSvg from '../icons/LinkSvg';
import PenToSquareSvg from '../icons/PenToSquareSvg';
import ActivityInfoPanel from './ActivityInfoPanel';
import CustomCalendar from './CustomCalendar';

interface Props {
  completionDates: CompletionDate[];
  selectedActivity: Activity;
  currentStreak?: number;
  onComplete: (selectedDate?: string) => void;
}

const ActivityCalendar = ({
  completionDates,
  selectedActivity,
  currentStreak,
  onComplete,
}: Props) => {
  const { type, note } = selectedActivity;

  const customRed2 = getTokenValue('$customRed2');

  return (
    <Container>
      <CustomCalendar completionDates={completionDates} onComplete={onComplete} />
      {type === 'habit' && (
        <ActivityInfoPanel icon={<LinkSvg fill={customRed2} />} title="Streak">
          <PanelText
            color="$customRed1"
            textTransform="uppercase"
            fontSize={18}
            fontWeight="bold"
          >
            {`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
          </PanelText>
        </ActivityInfoPanel>
      )}
      <ActivityInfoPanel
        icon={<PenToSquareSvg fill={customRed2} variant="outline" />}
        title="Notes"
      >
        <PanelText>{note ? note : 'no notes for this activity'}</PanelText>
      </ActivityInfoPanel>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
});

const PanelText = styled(Text, {
  textAlign: 'center',
  color: 'gray',
  marginTop: 20,
});

export default ActivityCalendar;

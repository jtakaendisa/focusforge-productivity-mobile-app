import { styled, View } from 'tamagui';

import { CompletionDate } from '@/app/entities';
import CustomCalendar from './CustomCalendar';

interface Props {
  completionDates: CompletionDate[];
  onComplete: (selectedDate?: string) => void;
}

const ActivityCalendar = ({ completionDates, onComplete }: Props) => {
  return (
    <Container>
      <CustomCalendar completionDates={completionDates} onComplete={onComplete} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  paddingTop: 12,
});

export default ActivityCalendar;

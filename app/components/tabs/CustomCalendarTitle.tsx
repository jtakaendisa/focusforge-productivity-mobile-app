import { styled, Text, View } from 'tamagui';

interface Props {
  date?: XDate;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CustomCalendarTitle = ({ date }: Props) => {
  if (!date) return null;

  return (
    <Container>
      <MonthText>{months[date.getMonth()]}</MonthText>
      <YearText>{date.getFullYear()}</YearText>
    </Container>
  );
};

const Container = styled(View, {
  gap: 2,
  alignItems: 'center',
});

const MonthText = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
});

const YearText = styled(Text, {
  fontSize: 17,
  color: 'gray',
});

export default CustomCalendarTitle;

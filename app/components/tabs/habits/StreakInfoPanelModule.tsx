import { styled, Text, View } from 'tamagui';

interface Props {
  currentStreak: number;
  bestStreak: number;
}

const StreakInfoPanelModule = ({ currentStreak, bestStreak }: Props) => {
  return (
    <Container>
      <StatContainer borderRightWidth={1} borderColor="$customGray2">
        <HeadingText>Current</HeadingText>
        <ValueText>
          {`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
        </ValueText>
      </StatContainer>
      <StatContainer>
        <HeadingText>Best</HeadingText>
        <ValueText>{`${bestStreak} ${bestStreak === 1 ? 'day' : 'days'}`}</ValueText>
      </StatContainer>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  height: 64,
  paddingTop: 12,
});

const StatContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
});

const HeadingText = styled(Text, {
  color: '$customGray1',
});

const ValueText = styled(Text, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '$customRed1',
  textTransform: 'uppercase',
});

export default StreakInfoPanelModule;

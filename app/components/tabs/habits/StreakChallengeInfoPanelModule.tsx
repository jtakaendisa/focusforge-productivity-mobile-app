import { styled, View, Text } from 'tamagui';
import AchievementMedalIcon from './AchievementMedalIcon';

interface Props {
  currentStreak: number;
}

const achievementValues = [1, 7, 15, 30, 60];

const StreakChallengeInfoPanelModule = ({ currentStreak }: Props) => {
  return (
    <Container>
      {achievementValues.map((achievementValue) => (
        <Column key={achievementValue}>
          <MedalIconContainer>
            <AchievementMedalIcon
              isAchievementUnlocked={currentStreak >= achievementValue}
            />
          </MedalIconContainer>
          <AchievementText>
            {achievementValue} {achievementValue === 1 ? 'day' : 'days'}
          </AchievementText>
        </Column>
      ))}
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 12,
  paddingHorizontal: 8,
});

const Column = styled(View, {
  alignItems: 'center',
  gap: 2,
});

const MedalIconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 68,
  height: 68,
  borderRadius: 18,
  backgroundColor: '$customGray2',
});

const AchievementText = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
});

export default StreakChallengeInfoPanelModule;

import { Image } from 'tamagui';

interface Props {
  isAchievementUnlocked: boolean;
  size?: number;
}

const AchievementMedalIcon = ({ isAchievementUnlocked, size = 40 }: Props) => {
  const imageUri = isAchievementUnlocked
    ? require('@/assets/images/achievement-medal-color.png')
    : require('@/assets/images/achievement-medal-monotone.png');

  return (
    <Image
      source={{
        uri: imageUri,
        width: size,
        height: size * 1.25,
      }}
    />
  );
};

export default AchievementMedalIcon;

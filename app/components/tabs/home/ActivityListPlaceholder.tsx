import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { SearchRoute } from '@/app/entities';
import { useSearchStore } from '@/app/store';
import { format } from 'date-fns';
import { usePathname } from 'expo-router';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Image, styled, Text, View } from 'tamagui';

const searchImages: Record<SearchRoute, any> = {
  home: require('@/assets/images/placeholder-calendar.png'),
  habits: require('@/assets/images/placeholder-trophy.png'),
  tasks: require('@/assets/images/placeholder-checklist.png'),
};

const searchPlaceholders = {
  home: {
    heading: format(new Date(), 'dd MMMM yyyy'),
    subtext: 'No results found in due activities',
  },
  habits: {
    heading: 'No results found in active habits',
    subtext: 'Try different search terms',
  },
  tasks: {
    heading: 'No results found in tasks',
    subtext: 'Try different search terms',
  },
};

const defaultPlaceholder = {
  image: require('@/assets/images/placeholder.png'),
  heading: 'There is nothing scheduled',
  subtext: 'Try adding new activities',
};

const ActivityListPlaceholder = () => {
  const pathname = (usePathname().substring(1) || 'home') as SearchRoute;

  const isSearchBarOpen = useSearchStore((s) => s.isSearchBarOpen);

  const currentImage = isSearchBarOpen
    ? searchImages[pathname]
    : defaultPlaceholder.image;

  const currentPlaceholder = isSearchBarOpen
    ? searchPlaceholders[pathname]
    : defaultPlaceholder;

  return (
    <AnimatedContainer entering={FadeInDown} exiting={FadeOutUp}>
      <Image
        source={{
          uri: currentImage,
          width: SCREEN_WIDTH / 2,
          height: SCREEN_HEIGHT / 4.4,
        }}
      />
      <TextContainer>
        <Heading>{currentPlaceholder.heading}</Heading>
        <SubText>{currentPlaceholder.subtext}</SubText>
      </TextContainer>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  gap: 36,
  alignItems: 'center',
  marginTop: -SCREEN_HEIGHT / 15,
});

const TextContainer = styled(View, {
  alignItems: 'center',
  gap: 6,
});

const Heading = styled(Text, {
  fontSize: 17,
  color: 'white',
});

const SubText = styled(Text, {
  fontSize: 14.5,
  color: '$customGray1',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default ActivityListPlaceholder;

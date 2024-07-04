import { SafeAreaView, StatusBar } from 'react-native';
import SearchBar from './tasks/SearchBar';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { styled } from 'tamagui';
import DefaultHeader from './DefaultHeader';
import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  options: {
    title: string;
  };
  isSearchBarOpen: boolean;
  isCurrentScreenHome: boolean;
  closeSearchBar: () => boolean;
}

const CustomHeader = ({
  options: { title },
  isSearchBarOpen,
  isCurrentScreenHome,
  closeSearchBar,
}: Props) => {
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const defaultHeaderHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const headerHeight = defaultHeaderHeight - statusBarHeight;

  return (
    <Container height={defaultHeaderHeight} isSearchBarOpen={isSearchBarOpen}>
      {isSearchBarOpen ? (
        <SearchBar
          height={headerHeight}
          isCurrentScreenHome={isCurrentScreenHome}
          closeSearchBar={closeSearchBar}
        />
      ) : (
        <DefaultHeader height={headerHeight} title={title} />
      )}
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  justifyContent: 'flex-end',
  variants: {
    isSearchBarOpen: {
      true: {
        backgroundColor: '#1C1C1C',
      },
      false: {
        backgroundColor: '#111111',
      },
    },
  } as const,
});

export default CustomHeader;

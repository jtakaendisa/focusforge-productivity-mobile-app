import { SafeAreaView, StatusBar } from 'react-native';
import SearchBar from './SearchBar';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { styled } from 'tamagui';
import DefaultHeader from './DefaultHeader';
import { useAppStore } from '@/app/store';
import { useEffect } from 'react';

interface Props {
  title?: string;
}

const CustomHeader = ({ title }: Props) => {
  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const setHeaderHeight = useAppStore((s) => s.setHeaderHeight);

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const defaultHeaderHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const headerHeight = defaultHeaderHeight - statusBarHeight;

  useEffect(() => {
    if (headerHeight) {
      setHeaderHeight(headerHeight);
    }
  }, [headerHeight, setHeaderHeight]);

  return (
    <Container height={defaultHeaderHeight} isSearchBarOpen={isSearchBarOpen}>
      {isSearchBarOpen ? (
        <SearchBar height={headerHeight} />
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
        backgroundColor: '$customGray3',
      },
      false: {
        backgroundColor: '$customBlack1',
      },
    },
  } as const,
});

export default CustomHeader;

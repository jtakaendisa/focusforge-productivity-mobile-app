import useHeaderHeight from '@/app/hooks/useHeaderHeight';
import { useSearchStore } from '@/app/store';
import { SafeAreaView } from 'react-native';
import { styled } from 'tamagui';
import DefaultHeader from './DefaultHeader';
import SearchBar from './SearchBar';

interface Props {
  title?: string;
}

const CustomHeader = ({ title }: Props) => {
  const isSearchBarOpen = useSearchStore((s) => s.isSearchBarOpen);

  const { defaultHeaderHeight, statusBarHeight, headerHeight } = useHeaderHeight();

  return (
    <Container height={defaultHeaderHeight} isSearchBarOpen={isSearchBarOpen}>
      {isSearchBarOpen ? (
        <SearchBar headerHeight={headerHeight} statusBarHeight={statusBarHeight} />
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

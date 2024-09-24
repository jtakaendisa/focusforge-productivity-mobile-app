import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { View, styled } from 'tamagui';

import ActivityList from '@/app/components/tabs/home/ActivityList';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';
import DateCarousel from '../../components/tabs/home/DateCarousel';
import NewActivityModal from '../../components/tabs/modals/NewActivityModal';
import NewActivityButton from '../../components/tabs/NewActivityButton';
import { TabRoute } from '../../entities';
import { useSearchStore } from '../../store';

const HomeScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useSearchStore((s) => s.isSearchBarOpen);

  const newActivityModalRef = useRef<BottomSheetModal | null>(null);

  const toggleNewActivityModal = () => newActivityModalRef.current?.present();

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'home' && isSearchBarOpen} />
      <DateCarousel />
      <ActivityList pathname={pathname} isSearchBarOpen={isSearchBarOpen} />
      <NewActivityButton onPress={toggleNewActivityModal} />
      <NewActivityModal newActivityModalRef={newActivityModalRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '$customBlack1',
});

export default HomeScreen;

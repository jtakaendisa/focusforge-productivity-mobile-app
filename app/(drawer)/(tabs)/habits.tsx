import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { styled, View } from 'tamagui';

import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { TabRoute } from '@/app/entities';
import { usePathname } from 'expo-router';
import NewActivityButton from '../../components/tabs/NewActivityButton';
import HabitList from '../../components/tabs/habits/HabitList';
import NewActivityModal from '../../components/tabs/modals/NewActivityModal';
import { useSearchStore } from '../../store';

const HabitsScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useSearchStore((s) => s.isSearchBarOpen);

  const newActivityModalRef = useRef<BottomSheetModal | null>(null);

  const toggleNewActivityModal = () => newActivityModalRef.current?.present();

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'habits' && isSearchBarOpen} />
      <HabitList pathname={pathname} isSearchBarOpen={isSearchBarOpen} />
      <NewActivityButton onPress={toggleNewActivityModal} />
      <NewActivityModal newActivityModalRef={newActivityModalRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

export default HabitsScreen;

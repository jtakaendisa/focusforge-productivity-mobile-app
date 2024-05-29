import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { AnimatedFlashList, FlashList, ViewToken } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, styled } from 'tamagui';

import { SCREEN_WIDTH } from './constants';
import HabitListItem from './components/habits/HabitListItem';

const listItems = [0, 1, 2, 3];

const NewHabitScreen = () => {
  const [listIndex, setListIndex] = useState(0);

  const listRef = useRef<FlashList<typeof listItems> | null>(null);

  const handleViewableItemChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0] && viewableItems[0].index !== null) {
      setListIndex(viewableItems[0].index);
    }
  };

  const handleNavigateBackward = () => {
    if (listIndex > 0) {
      listRef.current?.scrollToIndex({
        index: listIndex - 1,
        animated: true,
      });
    } else {
      router.back();
    }
  };

  const handleNavigateForward = async () => {
    if (listIndex < listItems.length - 1) {
      listRef.current?.scrollToIndex({
        index: listIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <Container>
      <AnimatedFlashList
        ref={listRef}
        data={listItems}
        renderItem={({ item }) => <HabitListItem item={item} />}
        keyExtractor={(item) => item}
        estimatedItemSize={SCREEN_WIDTH}
        onViewableItemsChanged={handleViewableItemChange}
        scrollEnabled={false}
        pagingEnabled
        horizontal
      />
      <ButtonsContainer>
        <Button onPress={handleNavigateBackward}>
          <ButtonText>{listIndex === 0 ? 'CANCEL' : 'BACK'}</ButtonText>
        </Button>
        <Button>
          <ButtonText>* * *</ButtonText>
        </Button>
        <Button onPress={handleNavigateForward}>
          <ButtonText color="#C73A57">NEXT</ButtonText>
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '#111111',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '#1C1C1C',
  borderTopWidth: 1,
  borderColor: '#262626',
});

const Button = styled(View, {
  width: '33.333%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ButtonText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

export default NewHabitScreen;

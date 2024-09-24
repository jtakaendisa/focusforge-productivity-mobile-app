import { FlashList } from '@shopify/flash-list';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { BackHandler, ViewToken } from 'react-native';

const useListNavigationWithAbortModal = (
  listRef: MutableRefObject<FlashList<number[]> | null>,
  listItems: number[]
) => {
  const [listIndex, setListIndex] = useState(0);
  const [isAbortActionModalOpen, setIsAbortActionModalOpen] = useState(false);

  const isFirstIndex = listIndex === 0;
  const isLastIndex = listIndex === listItems.length - 1;

  const handleViewableItemChange = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0] && viewableItems[0].index !== null) {
      setListIndex(viewableItems[0].index);
    }
  };

  const navigateBackward = () => {
    if (!isFirstIndex) {
      listRef.current?.scrollToIndex({
        index: listIndex - 1,
        animated: true,
      });
    } else {
      toggleAbortActionModal();
    }
  };

  const navigateForward = async () => {
    if (listIndex < listItems.length - 1) {
      listRef.current?.scrollToIndex({
        index: listIndex + 1,
        animated: true,
      });
    }
  };

  const toggleAbortActionModal = useCallback(
    () => setIsAbortActionModalOpen((prev) => !prev),
    []
  );

  useEffect(() => {
    const backAction = () => {
      toggleAbortActionModal();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return {
    listIndex,
    isFirstIndex,
    isLastIndex,
    isAbortActionModalOpen,
    handleViewableItemChange,
    navigateBackward,
    navigateForward,
    toggleAbortActionModal,
  };
};

export default useListNavigationWithAbortModal;

import { MutableRefObject, useState } from 'react';
import { Activity } from '../entities';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const useListModals = (
  activityOptionsRef?: MutableRefObject<BottomSheetModal | null>,
  handleSelect?: (selectedActivity: Activity) => void
) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);
  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  const toggleActivityOptionsModal = (activity: Activity) => {
    handleSelect?.(activity);
    activityOptionsRef?.current?.present();
  };

  return {
    isDeleteModalOpen,
    isPriorityModalOpen,
    isChecklistModalOpen,
    toggleDeleteModal,
    togglePriorityModal,
    toggleChecklistModal,
    toggleActivityOptionsModal,
  };
};

export default useListModals;

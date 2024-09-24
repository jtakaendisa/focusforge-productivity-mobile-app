import { useState } from 'react';

const useActivityModals = () => {
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const toggleTitleModal = () => setIsTitleModalOpen((prev) => !prev);
  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);
  const toggleRemindersModal = () => setIsRemindersModalOpen((prev) => !prev);
  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);
  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);
  const toggleFrequencyModal = () => setIsFrequencyModalOpen((prev) => !prev);
  const toggleNoteModal = () => setIsNoteModalOpen((prev) => !prev);

  return {
    isTitleModalOpen,
    isCategoryModalOpen,
    isRemindersModalOpen,
    isChecklistModalOpen,
    isPriorityModalOpen,
    isFrequencyModalOpen,
    isNoteModalOpen,
    toggleTitleModal,
    toggleCategoryModal,
    toggleRemindersModal,
    toggleChecklistModal,
    togglePriorityModal,
    toggleFrequencyModal,
    toggleNoteModal,
  };
};

export default useActivityModals;

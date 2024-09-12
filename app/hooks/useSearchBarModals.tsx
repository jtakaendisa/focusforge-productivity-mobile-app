import { useState } from 'react';

const useSearchBarModals = () => {
  const [isActivityFilterModalOpen, setIsActivityFilterModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const toggleActivityFilterModal = () => setIsActivityFilterModalOpen((prev) => !prev);
  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);

  return {
    isActivityFilterModalOpen,
    isCategoryModalOpen,
    toggleActivityFilterModal,
    toggleCategoryModal,
  };
};

export default useSearchBarModals;

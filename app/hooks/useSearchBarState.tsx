import { ActivityFilter, Category } from '@/app/entities';
import { useSearchStore } from '@/app/store';
import { useState } from 'react';

const useSearchBarState = (toggleActivityFilterModal?: () => void) => {
  const activityFilter = useSearchStore((s) => s.activityFilter);
  const filteredActivities = useSearchStore((s) => s.filteredActivities);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const setSelectedCategories = useSearchStore((s) => s.setSelectedCategories);
  const setActivityFilter = useSearchStore((s) => s.setActivityFilter);
  const setIsSearchBarOpen = useSearchStore((s) => s.setIsSearchBarOpen);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSelectedCategories, setLocalSelectedCategories] = useState<Category[]>(
    []
  );

  const handleSearchTermChange = (text: string) => {
    setLocalSearchTerm(text);
    setSearchTerm(text);
  };

  const handleCategorySelect = (selectedCategory: Category) => {
    const isCategoryAlreadySelected =
      localSelectedCategories.includes(selectedCategory);
    const updatedCategories = isCategoryAlreadySelected
      ? localSelectedCategories.filter((category) => category !== selectedCategory)
      : [...localSelectedCategories, selectedCategory];

    setLocalSelectedCategories(updatedCategories);
    setSelectedCategories(updatedCategories);
  };

  const handleCategoryClear = () => {
    setLocalSelectedCategories([]);
    setSelectedCategories([]);
  };

  const handleActivityFilterSelect = (activityFilter: ActivityFilter) => {
    setActivityFilter(activityFilter);
    toggleActivityFilterModal?.();
  };

  const handleFilterReset = () => {
    handleCategoryClear();
    setLocalSearchTerm('');
    setSearchTerm('');
    setActivityFilter('all');
  };

  const handleSearchBarClose = () => {
    handleFilterReset();
    setFilteredActivities([]);
    setIsSearchBarOpen(false);
  };

  return {
    activityFilter,
    filteredActivities,
    localSearchTerm,
    localSelectedCategories,
    handleSearchTermChange,
    handleCategorySelect,
    handleCategoryClear,
    handleActivityFilterSelect,
    handleFilterReset,
    handleSearchBarClose,
  };
};

export default useSearchBarState;

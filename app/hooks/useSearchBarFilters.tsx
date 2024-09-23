import { useEffect, useState } from 'react';
import { Activity } from '../entities';
import { useSearchStore } from '../store';

const useSearchBarFilters = (isOpen: boolean, activitiesToBeFiltered: Activity[]) => {
  const activityFilter = useSearchStore((s) => s.activityFilter);
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const selectedCategories = useSearchStore((s) => s.selectedCategories);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const [filtered, setFiltered] = useState<Activity[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFilteredActivities(activitiesToBeFiltered);
    }
  }, [isOpen, activitiesToBeFiltered]);

  useEffect(() => {
    if (!isOpen) return;

    if (!searchTerm.length) {
      setFiltered(activitiesToBeFiltered);
    } else {
      const filtered = activitiesToBeFiltered.filter((activity) =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filtered);
    }
  }, [isOpen, activitiesToBeFiltered, searchTerm]);

  useEffect(() => {
    if (!isOpen) return;

    if (!selectedCategories.length) {
      setFiltered(activitiesToBeFiltered);
    } else {
      const filtered = activitiesToBeFiltered.filter((activity) =>
        selectedCategories.includes(activity.category)
      );
      setFiltered(filtered);
    }
  }, [isOpen, activitiesToBeFiltered, selectedCategories]);

  useEffect(() => {
    if (!isOpen) return;

    switch (activityFilter) {
      case 'all':
        setFiltered(activitiesToBeFiltered);
        break;
      case 'habits':
        setFiltered(
          activitiesToBeFiltered.filter((activity) => activity.type === 'habit')
        );
        break;
      case 'tasks':
        setFiltered(
          activitiesToBeFiltered.filter((activity) => activity.type !== 'habit')
        );
        break;
    }
  }, [isOpen, activitiesToBeFiltered, activityFilter]);

  return filtered;
};

export default useSearchBarFilters;

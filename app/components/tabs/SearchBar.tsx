import { SCREEN_WIDTH } from '@/app/constants';
import {
  Activity,
  ActivityFilter,
  Category,
  Habit,
  TabRoute,
  Task,
} from '@/app/entities';
import { useActivityStore, useAppStore, useTaskStore } from '@/app/store';
import { toDateGroupedTasks, toFormattedSections } from '@/app/utils';
import { usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StatusBar, TextInput } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';
import ArrowDownSvg from '../icons/ArrowDownSvg';
import ArrowUpSvg from '../icons/ArrowUpSvg';
import BinSvg from '../icons/BinSvg';
import ActivityFilterModalModule from './modals/ActivityFilterModalModule';
import ModalContainer from './modals/ModalContainer';
import SearchBarCategoryModalModule from './modals/SearchBarCategoryModalModule';
import RippleButton from './RippleButton';

interface Props {
  height: number;
  habits: Habit[];
  singleTasks: (Task | string)[];
  recurringTasks: Task[];
}

const animationConfig = {
  duration: 350,
};

const SearchBar = ({ height, habits, singleTasks, recurringTasks }: Props) => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;
  const isCurrentScreenHome = pathname === 'home';

  const statusBarHeight = StatusBar.currentHeight;

  const filter = useTaskStore((s) => s.filter);
  const filteredActivities = useActivityStore((s) => s.filteredActivities);
  const setIsSearchBarOpen = useAppStore((s) => s.setIsSearchBarOpen);
  const setFilteredActivities = useActivityStore((s) => s.setFilteredActivities);
  const setFilteredHabits = useActivityStore((s) => s.setFilteredHabits);
  const setFilteredSingleTasks = useActivityStore((s) => s.setFilteredSingleTasks);
  const setFilteredRecurringTasks = useActivityStore(
    (s) => s.setFilteredRecurringTasks
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[] | (Task | string)[]>([]);
  const [modalState, setModalState] = useState({
    isActivityFilterOpen: false,
    isCategoryOpen: false,
  });

  const { isActivityFilterOpen, isCategoryOpen } = modalState;

  const initialFilteredActivities = useMemo(() => filteredActivities, []);

  const isSearchRowVisible = useSharedValue(0);

  const handleActivitiesReset = () => {
    switch (pathname) {
      case 'home':
        setFilteredActivities(initialFilteredActivities);
        break;
      case 'habits':
        setFilteredHabits(habits);
        break;
      case 'tasks':
        if (filter === 'single') {
          setFilteredSingleTasks(singleTasks);
        } else {
          setFilteredRecurringTasks(recurringTasks);
        }
        break;
    }
  };

  const filterActivitiesByActivityFilter = (filter: ActivityFilter) => {
    let filtered: any[] = [];
    if (filter === 'all') {
      filtered = initialFilteredActivities;
    }
    if (filter === 'habits') {
      filtered = initialFilteredActivities.filter((activity) => {
        const isHabit = Boolean((activity as Task)?.checklist) === false;
        if (isHabit) {
          return activity;
        }
      });
    }
    if (filter === 'tasks') {
      filtered = initialFilteredActivities.filter((activity) => {
        const isTask = Boolean((activity as Task)?.checklist) === true;
        if (isTask) {
          return activity;
        }
      });
    }
    setActivities(filtered);
    setFilteredActivities(filtered);
  };

  const handleActivityFilterChange = (activityFilter: ActivityFilter) => {
    filterActivitiesByActivityFilter(activityFilter);
    setActivityFilter(activityFilter);
    toggleActivityFilterModal();
  };

  const handleSearchTermChange = (text: string) => setSearchTerm(text);

  const handleSearchTermClear = () => {
    setSearchTerm('');
    handleActivitiesReset();
  };

  const handleSearchTermSubmit = () => {
    if (!searchTerm.trim().length) return;

    const filteredActivities = activities.filter((activity) => {
      if (typeof activity !== 'string') {
        return activity.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
      }
    });

    switch (pathname) {
      case 'home':
        setFilteredActivities(filteredActivities as Activity[]);
        break;
      case 'habits':
        setFilteredHabits(filteredActivities as Habit[]);
        break;
      case 'tasks':
        if (filter === 'single') {
          const dateGroupedTasks = toDateGroupedTasks(filteredActivities as Task[]);
          setFilteredSingleTasks(toFormattedSections(dateGroupedTasks));
        } else {
          setFilteredRecurringTasks(filteredActivities as Task[]);
        }
        break;
    }
  };

  const filterActivitiesByCategory = (selectedCategories: Category[]) => {
    const filteredActivities = activities.filter(
      (activity) =>
        typeof activity !== 'string' && selectedCategories.includes(activity.category)
    );

    switch (pathname) {
      case 'home':
        setFilteredActivities(filteredActivities as Activity[]);
        break;
      case 'habits':
        setFilteredHabits(filteredActivities as Habit[]);
        break;
      case 'tasks':
        if (filter === 'single') {
          const dateGroupedTasks = toDateGroupedTasks(filteredActivities as Task[]);
          setFilteredSingleTasks(toFormattedSections(dateGroupedTasks));
        } else {
          setFilteredRecurringTasks(filteredActivities as Task[]);
        }
        break;
    }
  };

  const handleCategorySelect = (category: Category) => {
    const isCategorySelected = selectedCategories.includes(category);
    let updatedSelectedCategories: Category[] = [];

    if (isCategorySelected) {
      updatedSelectedCategories = selectedCategories.filter((cat) => cat !== category);
      filterActivitiesByCategory(updatedSelectedCategories);
      setSelectedCategories(updatedSelectedCategories);
    } else {
      updatedSelectedCategories = [...selectedCategories, category];
      filterActivitiesByCategory(updatedSelectedCategories);
      setSelectedCategories(updatedSelectedCategories);
    }
  };

  const handleCategoryClear = () => setSelectedCategories([]);

  const handleSearchBarClose = () => {
    setIsSearchBarOpen(false);
    handleActivitiesReset();
  };

  const toggleActivityFilterModal = () =>
    setModalState({ ...modalState, isActivityFilterOpen: !isActivityFilterOpen });

  const toggleCategoryModal = () =>
    setModalState({ ...modalState, isCategoryOpen: !isCategoryOpen });

  const heightAnimation = useAnimatedStyle(() => ({
    height: isSearchRowVisible.value
      ? withTiming(height, animationConfig)
      : withTiming(0, animationConfig),
  }));

  useEffect(() => {
    switch (pathname) {
      case 'home':
        setActivities(initialFilteredActivities);
        break;
      case 'habits':
        setActivities(habits);
        break;
      case 'tasks':
        if (filter === 'single') {
          setActivities(singleTasks);
        } else {
          setActivities(recurringTasks);
        }
        break;
    }
  }, [pathname, initialFilteredActivities, habits, singleTasks, recurringTasks]);

  useEffect(() => {
    if (!isCategoryOpen) return;

    if (!selectedCategories.length) {
      handleActivitiesReset();
    }
  }, [selectedCategories, isCategoryOpen]);

  useEffect(() => {
    isSearchRowVisible.value = 1;
  }, []);

  const customGray1 = getTokenValue('$customGray1');

  return (
    <AnimatedContainer height={height} entering={FadeIn} exiting={FadeOut}>
      <FilterRow>
        {isCurrentScreenHome && (
          <ActivityFilterContainer width={SCREEN_WIDTH / 3}>
            <FilterText textTransform="capitalize">{activityFilter}</FilterText>
            <RippleButton fade onPress={toggleActivityFilterModal}>
              <IconContainer width={height * 0.75}>
                <ArrowDownSvg size={14} />
              </IconContainer>
            </RippleButton>
          </ActivityFilterContainer>
        )}
        <RippleButton flex onPress={toggleCategoryModal}>
          <CategoryContainer height={height}>
            <FilterText color={customGray1}>Select a category</FilterText>
          </CategoryContainer>
        </RippleButton>
      </FilterRow>

      <AnimatedSearchRow style={heightAnimation}>
        <SearchInputField
          placeholder="Search for an activity..."
          placeholderTextColor={customGray1}
          onChangeText={handleSearchTermChange}
          onEndEditing={handleSearchTermSubmit}
          value={searchTerm}
        />
        <ButtonContainer>
          <RippleButton fade onPress={handleSearchTermClear}>
            <IconContainer width={height} height={height}>
              <BinSvg size={22} fill={customGray1} variant="outline" />
            </IconContainer>
          </RippleButton>
          <RippleButton fade onPress={handleSearchBarClose}>
            <IconContainer width={height} height={height}>
              <ArrowUpSvg size={18} />
            </IconContainer>
          </RippleButton>
        </ButtonContainer>
      </AnimatedSearchRow>

      <ModalContainer
        isOpen={isActivityFilterOpen}
        transparentBackdrop
        closeModal={toggleActivityFilterModal}
      >
        {statusBarHeight && (
          <ActivityFilterModalModule
            onSelect={handleActivityFilterChange}
            offsetTop={statusBarHeight}
            width={SCREEN_WIDTH / 3 - height * 0.75}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isCategoryOpen} closeModal={toggleCategoryModal}>
        <SearchBarCategoryModalModule
          activities={activities}
          selectedCategories={selectedCategories}
          onSelect={handleCategorySelect}
          onClear={handleCategoryClear}
          closeModal={toggleCategoryModal}
        />
      </ModalContainer>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  position: 'relative',
  justifyContent: 'flex-end',
});

const FilterRow = styled(View, {
  flex: 1,
  flexDirection: 'row',
});

const FilterText = styled(Text, {
  fontSize: 16,
});

const ActivityFilterContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: 12,
  borderRightWidth: 1,
  borderColor: '$customGray2',
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const SearchRow = styled(View, {
  position: 'absolute',
  top: '100%',
  width: '100%',
  flexDirection: 'row',
  backgroundColor: '$customGray3',
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const IconContainer = styled(View, {
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const SearchInputField = styled(TextInput, {
  flex: 1,
  paddingHorizontal: 12,
  //@ts-ignore
  fontSize: 16,
  color: 'white',
});

const ButtonContainer = styled(View, {
  flexDirection: 'row',
  borderLeftWidth: 1,
  borderColor: '$customGray2',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedSearchRow = Animated.createAnimatedComponent(SearchRow);

export default SearchBar;

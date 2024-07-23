import { SCREEN_WIDTH } from '@/app/constants';
import {
  Activity,
  ActivityFilter,
  Category,
  Habit,
  TabRoute,
  Task,
} from '@/app/entities';
import { useAppStore, useTaskStore, useActivityStore } from '@/app/store';
import { usePathname } from 'expo-router';
import { StatusBar, TextInput } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Text, View, getTokenValue, styled } from 'tamagui';
import RippleButton from './RippleButton';
import { useEffect, useMemo, useState } from 'react';
import ModalContainer from './modals/ModalContainer';
import SearchBarCategoryModalModule from './modals/SearchBarCategoryModalModule';
import ActivityFilterModalModule from './modals/ActivityFilterModalModule';
import { toDateGroupedTasks, toFormattedSections } from '@/app/utils';

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
            <RippleButton onPress={toggleActivityFilterModal}>
              <IconContainer width={height * 0.75}>
                <Svg width="14" height="14" viewBox="0 0 20 11" fill="none">
                  <Path
                    d="M9.35777 10.6422C9.71014 10.9946 10.2899 10.9946 10.6422 10.6422L19.7357 1.54874C20.0881 1.19636 20.0881 0.616652 19.7357 0.26428C19.3833 -0.0880932 18.8036 -0.0880932 18.4513 0.26428L10 8.71554L1.54874 0.26428C1.19636 -0.0880932 0.616652 -0.0880932 0.26428 0.26428C-0.0880932 0.616652 -0.0880932 1.19636 0.26428 1.54874L9.35777 10.6422Z"
                    fill="white"
                  />
                </Svg>
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
          <RippleButton onPress={handleSearchTermClear}>
            <IconContainer width={height} height={height}>
              <Svg width="22" height="22" viewBox="0 0 20 22" fill="none">
                <Path
                  d="M7.32617 2.21719L6.50977 3.4375H12.7402L11.9238 2.21719C11.8594 2.12266 11.752 2.0625 11.6359 2.0625H7.60977C7.49375 2.0625 7.38633 2.11836 7.32187 2.21719H7.32617ZM13.6426 1.07422L15.2195 3.4375H15.8082H17.875H18.2188C18.7902 3.4375 19.25 3.89727 19.25 4.46875C19.25 5.04023 18.7902 5.5 18.2188 5.5H17.7203L16.6891 19.452C16.5816 20.8871 15.3871 22 13.9477 22H5.30234C3.86289 22 2.66836 20.8871 2.56094 19.452L1.52969 5.5H1.03125C0.459766 5.5 0 5.04023 0 4.46875C0 3.89727 0.459766 3.4375 1.03125 3.4375H1.375H3.4418H4.03047L5.60742 1.06992C6.0543 0.403906 6.80625 0 7.60977 0H11.6359C12.4395 0 13.1914 0.403906 13.6383 1.06992L13.6426 1.07422ZM3.59648 5.5L4.61914 19.3016C4.64492 19.6625 4.9457 19.9375 5.30664 19.9375H13.9477C14.3086 19.9375 14.6051 19.6582 14.6352 19.3016L15.6535 5.5H3.59648ZM6.26914 9.01914C6.6043 8.68398 7.15 8.68398 7.48516 9.01914L9.625 11.159L11.7691 9.01484C12.1043 8.67969 12.65 8.67969 12.9852 9.01484C13.3203 9.35 13.3203 9.8957 12.9852 10.2309L10.841 12.375L12.9852 14.5191C13.3203 14.8543 13.3203 15.4 12.9852 15.7352C12.65 16.0703 12.1043 16.0703 11.7691 15.7352L9.625 13.591L7.48086 15.7352C7.1457 16.0703 6.6 16.0703 6.26484 15.7352C5.92969 15.4 5.92969 14.8543 6.26484 14.5191L8.40898 12.375L6.26484 10.2309C5.92969 9.8957 5.92969 9.35 6.26484 9.01484L6.26914 9.01914Z"
                  fill={customGray1}
                />
              </Svg>
            </IconContainer>
          </RippleButton>
          <RippleButton onPress={handleSearchBarClose}>
            <IconContainer width={height} height={height}>
              <Svg width="18" height="18" viewBox="0 0 43 24" fill="none">
                <Path
                  d="M19.2499 0.813071C20.334 -0.271024 22.087 -0.271024 23.1595 0.813071L41.6237 19.2657C42.7078 20.3498 42.7078 22.1028 41.6237 23.1754C40.5396 24.248 38.7866 24.2595 37.7141 23.1754L21.222 6.68332L4.71841 23.1869C3.63432 24.271 1.88131 24.271 0.808751 23.1869C-0.26381 22.1028 -0.275343 20.3498 0.808751 19.2773L19.2499 0.813071Z"
                  fill="white"
                />
              </Svg>
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

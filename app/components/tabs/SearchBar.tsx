import { SCREEN_WIDTH } from '@/app/constants';
import { ActivityFilter, Category, TabRoute } from '@/app/entities';
import { useSearchStore } from '@/app/store';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
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
}

const animationConfig = {
  duration: 350,
};

const SearchBar = ({ height }: Props) => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const statusBarHeight = StatusBar.currentHeight;

  const activityFilter = useSearchStore((s) => s.activityFilter);
  const filteredActivities = useSearchStore((s) => s.filteredActivities);
  const setIsSearchBarOpen = useSearchStore((s) => s.setIsSearchBarOpen);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const setActivityFilter = useSearchStore((s) => s.setActivityFilter);
  const setSelectedCategories = useSearchStore((s) => s.setSelectedCategories);
  const setFilteredActivities = useSearchStore((s) => s.setFilteredActivities);

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localSelectedCategories, setLocalSelectedCategories] = useState<Category[]>(
    []
  );
  const [isActivityFilterModalOpen, setIsActivityFilterModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const isSearchRowVisible = useSharedValue(0);

  const handleActivityFilterSelect = (activityFilter: ActivityFilter) => {
    setActivityFilter(activityFilter);
    toggleActivityFilterModal();
  };

  const handleSearchTermChange = (text: string) => {
    setLocalSearchTerm(text);
    setSearchTerm(text);
  };

  const handleCategorySelect = (selectedCategory: Category) => {
    const isCategoryAlreadySelected =
      localSelectedCategories.includes(selectedCategory);

    let updatedSelectedCategories: Category[] = [];

    if (isCategoryAlreadySelected) {
      updatedSelectedCategories = localSelectedCategories.filter(
        (category) => category !== selectedCategory
      );
    } else {
      updatedSelectedCategories = [...localSelectedCategories, selectedCategory];
    }
    setLocalSelectedCategories(updatedSelectedCategories);
    setSelectedCategories(updatedSelectedCategories);
  };

  const handleCategoryClear = () => {
    setLocalSelectedCategories([]);
    setSelectedCategories([]);
  };

  const handleFilterReset = () => {
    setLocalSearchTerm('');
    handleCategoryClear();

    setSearchTerm('');
    setSelectedCategories([]);
    setActivityFilter('all');
  };

  const handleSearchBarClose = () => {
    handleFilterReset();
    setFilteredActivities([]);
    setIsSearchBarOpen(false);
  };

  const toggleActivityFilterModal = () => setIsActivityFilterModalOpen((prev) => !prev);

  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);

  const heightAnimation = useAnimatedStyle(() => ({
    height: isSearchRowVisible.value
      ? withTiming(height, animationConfig)
      : withTiming(0, animationConfig),
  }));

  useEffect(() => {
    isSearchRowVisible.value = 1;
  }, []);

  const customGray1 = getTokenValue('$customGray1');

  return (
    <AnimatedContainer height={height} entering={FadeIn} exiting={FadeOut}>
      <FilterRow>
        {pathname === 'home' && (
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
            <FilterText color="$customGray1">
              {!!localSelectedCategories.length
                ? `${localSelectedCategories.length} ${
                    localSelectedCategories.length === 1 ? 'category' : 'categories'
                  } selected`
                : 'Select a category'}
            </FilterText>
          </CategoryContainer>
        </RippleButton>
      </FilterRow>

      <AnimatedSearchRow style={heightAnimation}>
        <SearchInputField
          placeholder="Search for an activity..."
          placeholderTextColor={customGray1}
          onChangeText={handleSearchTermChange}
          value={localSearchTerm}
        />
        <ButtonContainer>
          <RippleButton fade onPress={handleFilterReset}>
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
        isOpen={isActivityFilterModalOpen}
        transparentBackdrop
        closeModal={toggleActivityFilterModal}
      >
        {statusBarHeight && (
          <ActivityFilterModalModule
            onSelect={handleActivityFilterSelect}
            offsetTop={statusBarHeight}
            width={SCREEN_WIDTH / 3 - height * 0.75}
          />
        )}
      </ModalContainer>
      <ModalContainer isOpen={isCategoryModalOpen} closeModal={toggleCategoryModal}>
        <SearchBarCategoryModalModule
          activities={filteredActivities}
          selectedCategories={localSelectedCategories}
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

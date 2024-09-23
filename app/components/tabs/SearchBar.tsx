import { SCREEN_WIDTH } from '@/app/constants';
import { TabRoute } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import useSearchBarAnimation from '@/app/hooks/useSearchBarAnimation';
import useSearchBarModals from '@/app/hooks/useSearchBarModals';
import useSearchBarState from '@/app/hooks/useSearchBarState';
import { usePathname } from 'expo-router';
import { TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, View, styled } from 'tamagui';
import ArrowDownSvg from '../icons/ArrowDownSvg';
import ArrowUpSvg from '../icons/ArrowUpSvg';
import BinSvg from '../icons/BinSvg';
import ActivityFilterModalModule from './modals/ActivityFilterModalModule';
import ModalContainer from './modals/ModalContainer';
import SearchBarCategoryModalModule from './modals/SearchBarCategoryModalModule';
import RippleButton from './RippleButton';

interface Props {
  headerHeight: number;
  statusBarHeight: number;
}

const SearchBar = ({ headerHeight, statusBarHeight }: Props) => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const {
    isActivityFilterModalOpen,
    isCategoryModalOpen,
    toggleActivityFilterModal,
    toggleCategoryModal,
  } = useSearchBarModals();

  const {
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
  } = useSearchBarState(toggleActivityFilterModal);

  const { heightAnimation, opacityAnimation } = useSearchBarAnimation(headerHeight);

  const { customGray1 } = useCustomColors();

  return (
    <AnimatedContainer height={headerHeight} entering={FadeIn} exiting={FadeOut}>
      <FilterRow>
        {pathname === 'home' && (
          <ActivityFilterContainer width={SCREEN_WIDTH / 3}>
            <FilterText textTransform="capitalize">{activityFilter}</FilterText>
            <RippleButton fade onPress={toggleActivityFilterModal}>
              <IconContainer width={headerHeight * 0.75}>
                <ArrowDownSvg size={14} />
              </IconContainer>
            </RippleButton>
          </ActivityFilterContainer>
        )}
        <RippleButton flex onPress={toggleCategoryModal}>
          <CategoryContainer height={headerHeight}>
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
            <AnimatedIconContainer
              style={opacityAnimation}
              width={headerHeight}
              height={headerHeight}
            >
              <BinSvg size={22} fill={customGray1} variant="outline" />
            </AnimatedIconContainer>
          </RippleButton>
          <RippleButton fade onPress={handleSearchBarClose}>
            <AnimatedIconContainer
              style={opacityAnimation}
              width={headerHeight}
              height={headerHeight}
            >
              <ArrowUpSvg size={18} />
            </AnimatedIconContainer>
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
            width={SCREEN_WIDTH / 3 - headerHeight * 0.75}
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
const AnimatedIconContainer = Animated.createAnimatedComponent(IconContainer);

export default SearchBar;

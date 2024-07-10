import { useEffect, useState } from 'react';
import { Activity, Category } from '@/app/entities';
import { styled, View, Text, ScrollView, getTokenValue } from 'tamagui';
import { SCREEN_HEIGHT } from '@/app/constants';
import { FlashList } from '@shopify/flash-list';
import SearchBarCategoryCard from '../SearchBarCategoryCard';

interface Props {
  activities: Activity[];
  onSelect: (category: Category, mode: 'add' | 'remove') => void;
  onClear: () => void;
  closeModal: () => void;
}

const SearchBarCategoryModalModule = ({
  activities,
  onSelect,
  onClear,
  closeModal,
}: Props) => {
  const [uniqueCategories, setUniqueCategories] = useState<
    { name: Category; isSelected: boolean }[]
  >([]);

  const handleSelect = (name: Category) => {
    const categoryIsSelected = uniqueCategories.find(
      (category) => category.name === name
    )?.isSelected;

    if (categoryIsSelected) {
      onSelect(name, 'remove');
    } else {
      onSelect(name, 'add');
    }

    setUniqueCategories(
      uniqueCategories.map((category) =>
        category.name === name
          ? { ...category, isSelected: !category.isSelected }
          : category
      )
    );
  };

  const handleClear = () => {
    setUniqueCategories(
      uniqueCategories.map((category) => ({ ...category, isSelected: false }))
    );
    onClear();
  };

  useEffect(() => {
    const categories = activities.map((activity) => activity.category);
    const uniqueCategories = [...new Set(categories)].map((category) => ({
      name: category,
      isSelected: false,
    }));
    setUniqueCategories(uniqueCategories);
  }, [activities]);

  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Select a category</HeadingText>
      </HeadingContainer>

      <ScrollView maxHeight={SCREEN_HEIGHT / 3}>
        <MainContent>
          <FlashList
            data={uniqueCategories}
            renderItem={({ item }) => (
              <SearchBarCategoryCard item={item} onSelect={handleSelect} />
            )}
            keyExtractor={(item) => item.name}
            estimatedItemSize={54}
          />
        </MainContent>
      </ScrollView>

      <Button onPress={handleClear}>
        <ButtonText>Clear Selection</ButtonText>
      </Button>
      <Button onPress={closeModal}>
        <ButtonText color={customRed1}>Close</ButtonText>
      </Button>
    </Container>
  );
};

const Container = styled(View, {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '$customGray3',
});

const HeadingContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const HeadingText = styled(Text, {
  fontSize: 16,
});

const MainContent = styled(View, {
  height: SCREEN_HEIGHT / 3,
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default SearchBarCategoryModalModule;

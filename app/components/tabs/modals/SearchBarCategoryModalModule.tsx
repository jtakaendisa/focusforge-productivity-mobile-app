import { useEffect, useState } from 'react';
import { Activity, Category, Task } from '@/app/entities';
import { styled, View, Text, ScrollView, getTokenValue } from 'tamagui';
import { SCREEN_HEIGHT } from '@/app/constants';
import { FlashList } from '@shopify/flash-list';
import SearchBarCategoryCard from '../SearchBarCategoryCard';

interface Props {
  activities: Activity[] | (Task | string)[];
  selectedCategories: Category[];
  onSelect: (category: Category) => void;
  onClear: () => void;
  closeModal: () => void;
}

const SearchBarCategoryModalModule = ({
  activities,
  selectedCategories,
  onSelect,
  onClear,
  closeModal,
}: Props) => {
  const [uniqueCategories, setUniqueCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categories = activities
      .map((activity) => typeof activity !== 'string' && activity.category)
      .filter((category) => !!category);

    setUniqueCategories([...new Set(categories)]);
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
              <SearchBarCategoryCard
                isSelected={selectedCategories.includes(item)}
                category={item}
                onSelect={onSelect}
              />
            )}
            keyExtractor={(item) => item}
            estimatedItemSize={54}
            extraData={selectedCategories}
          />
        </MainContent>
      </ScrollView>

      <Button onPress={onClear}>
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

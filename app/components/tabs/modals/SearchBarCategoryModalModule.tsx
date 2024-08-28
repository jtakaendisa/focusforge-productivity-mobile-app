import { SCREEN_HEIGHT } from '@/app/constants';
import { Activity, Category } from '@/app/entities';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { ScrollView, styled, Text, View } from 'tamagui';
import RippleButton from '../RippleButton';
import SearchBarCategoryCard from '../SearchBarCategoryCard';

interface Props {
  activities: (string | Activity)[];
  selectedCategories: Category[];
  onSelect: (selectedCategory: Category) => void;
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

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Select a category</HeadingText>
      </HeadingContainer>

      <ScrollView maxHeight={SCREEN_HEIGHT / 3}>
        <MainContent>
          <FlashList
            data={uniqueCategories}
            renderItem={({ item, index }) => (
              <SearchBarCategoryCard
                isSelected={selectedCategories.includes(item)}
                category={item}
                onSelect={onSelect}
                isLastIndex={index === uniqueCategories.length - 1}
              />
            )}
            keyExtractor={(item) => item}
            estimatedItemSize={54}
            extraData={selectedCategories}
          />
        </MainContent>
      </ScrollView>

      <RippleButton onPress={onClear}>
        <Button>
          <ButtonText>Clear Selection</ButtonText>
        </Button>
      </RippleButton>
      <RippleButton onPress={closeModal}>
        <Button>
          <ButtonText color="$customRed1">Close</ButtonText>
        </Button>
      </RippleButton>
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

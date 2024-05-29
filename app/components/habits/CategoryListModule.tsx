import { View, Text, styled } from 'tamagui';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { categoryArray } from '@/app/store';
import CategoryIcon from '../tabs/CategoryIcon';

const CategoryListModule = () => {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Select a category for your habit</Heading>
      </HeadingContainer>
      <CategoriesContainer>
        {categoryArray.map((category) => (
          <CategoryContainer key={category}>
            <CategoryCard>
              <CategoryCardInnerRow>
                <Text>{category}</Text>
                <CategoryIconContainer>
                  <CategoryIcon category={category} />
                </CategoryIconContainer>
              </CategoryCardInnerRow>
            </CategoryCard>
          </CategoryContainer>
        ))}
      </CategoriesContainer>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
});

const HeadingContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  height: 94,
});

const Heading = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#C73A57',
});

const CategoriesContainer = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const CategoryContainer = styled(View, {
  width: SCREEN_WIDTH / 2,
  height: 54,
  marginBottom: 8,
});

const CategoryCard = styled(View, {
  flex: 1,
  marginHorizontal: 8,
  backgroundColor: '#1C1C1C',
  borderRadius: 14,
});

const CategoryCardInnerRow = styled(View, {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginHorizontal: 8,
});

const CategoryIconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: 'gray',
  borderRadius: 8,
});

export default CategoryListModule;

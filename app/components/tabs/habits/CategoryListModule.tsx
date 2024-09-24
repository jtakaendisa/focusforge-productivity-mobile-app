import { Control, Controller } from 'react-hook-form';
import { styled, Text, View } from 'tamagui';

import {
  categories,
  categoryColorMap,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '@/app/constants';
import { NewActivityData } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import CategoryIcon from '../CategoryIcon';

interface Props {
  control: Control<NewActivityData>;
  navigateForward: () => void;
}

const CategoryListModule = ({ control, navigateForward }: Props) => {
  const { customBlack1 } = useCustomColors();

  return (
    <Container>
      <HeadingContainer>
        <Heading>Select a category for your habit</Heading>
      </HeadingContainer>
      <CategoriesContainer>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange } }) => (
            <>
              {categories.map((category) => (
                <CategoryContainer
                  key={category}
                  onPress={() => {
                    onChange(category);
                    navigateForward();
                  }}
                >
                  <CategoryCard>
                    <CategoryCardInnerRow>
                      <Text>{category}</Text>
                      <CategoryIconContainer
                        backgroundColor={categoryColorMap[category]}
                      >
                        <CategoryIcon category={category} fill={customBlack1} />
                      </CategoryIconContainer>
                    </CategoryCardInnerRow>
                  </CategoryCard>
                </CategoryContainer>
              ))}
            </>
          )}
        />
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
  color: '$customRed1',
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
  backgroundColor: '$customGray3',
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
  borderRadius: 8,
});

export default CategoryListModule;

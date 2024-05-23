import { Control, Controller } from 'react-hook-form';
import { View, Text, styled, ScrollView } from 'tamagui';

import { categoryArray } from '@/app/store';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/app/constants';
import { NewTaskData } from '@/app/newTask';
import CategoryIcon from '../CategoryIcon';

interface Props {
  control: Control<NewTaskData>;
  closeModal: () => void;
}

const CARD_SIZE = (0.8 * SCREEN_WIDTH - 56) / 3;

const CategoryModalModule = ({ control, closeModal }: Props) => {
  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Select a category</HeadingText>
      </HeadingContainer>
      <ScrollView maxHeight={SCREEN_HEIGHT / 3}>
        <MainContent onLayout={(e) => console.log(e.nativeEvent.layout.width)}>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange } }) => (
              <>
                {categoryArray.map((category) => (
                  <CategoryCard
                    key={category}
                    onPress={() => {
                      onChange(category);
                      closeModal();
                    }}
                  >
                    <CategoryContainer>
                      <CategoryIcon category={category} />
                    </CategoryContainer>
                    <CategoryTitle>{category}</CategoryTitle>
                  </CategoryCard>
                ))}
              </>
            )}
          />
        </MainContent>
      </ScrollView>
      <CloseButton onPress={closeModal}>
        <ButtonText color="#C73A57">CLOSE</ButtonText>
      </CloseButton>
    </Container>
  );
};

const Container = styled(View, {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '#1C1C1C',
});

const HeadingContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const HeadingText = styled(Text, {
  fontSize: 16,
});

const MainContent = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
});

const CategoryCard = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  width: CARD_SIZE,
  height: CARD_SIZE,
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: '#C73A57',
  borderRadius: 8,
});

const CategoryTitle = styled(Text, {
  fontSize: 12,
});

const CloseButton = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderTopWidth: 1,
  borderColor: '#262626',
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default CategoryModalModule;

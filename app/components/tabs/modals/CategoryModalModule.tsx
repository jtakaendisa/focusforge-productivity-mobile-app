import { Control, Controller } from 'react-hook-form';
import { View, Text, styled, ScrollView, getTokenValue } from 'tamagui';

import { categoryArray } from '@/app/store';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/app/constants';
import CategoryIcon from '../CategoryIcon';
import { NewActivityData } from '@/app/entities';
import RippleButton from '../RippleButton';

interface Props {
  control: Control<NewActivityData>;
  closeModal: () => void;
}

const CARD_SIZE = (0.8 * SCREEN_WIDTH - 56) / 3;

const CategoryModalModule = ({ control, closeModal }: Props) => {
  const customBlack1 = getTokenValue('$customBlack1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Select a category</HeadingText>
      </HeadingContainer>
      <ScrollView maxHeight={SCREEN_HEIGHT / 3}>
        <MainContent>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange } }) => (
              <>
                {categoryArray.map((category) => (
                  <RippleButton
                    key={category}
                    onPress={() => {
                      onChange(category);
                      closeModal();
                    }}
                  >
                    <CategoryCard>
                      <CategoryContainer>
                        <CategoryIcon category={category} fill={customBlack1} />
                      </CategoryContainer>
                      <CategoryTitle>{category}</CategoryTitle>
                    </CategoryCard>
                  </RippleButton>
                ))}
              </>
            )}
          />
        </MainContent>
      </ScrollView>
      <RippleButton onPress={closeModal}>
        <CloseButton>
          <ButtonText color={customRed1}>CLOSE</ButtonText>
        </CloseButton>
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
  backgroundColor: '$customRed1',
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
  borderColor: '$customGray2',
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default CategoryModalModule;

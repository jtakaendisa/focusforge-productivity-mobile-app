import { Control, Controller } from 'react-hook-form';
import { View, Text, styled } from 'tamagui';

import { categoryArray } from '@/app/store';
import { NewTaskData } from '@/app/newTask';
import ModalContainer, { ModalHeading } from './ModalContainer';

interface Props {
  control: Control<NewTaskData>;
  dismissKeyboard?: boolean;
  closeModal: () => void;
}

const CategoryModal = ({ control, dismissKeyboard, closeModal }: Props) => {
  return (
    <ModalContainer dismissKeyboard={dismissKeyboard} closeModal={closeModal}>
      <ModalHeading>
        <Text>Select a category</Text>
      </ModalHeading>
      <CategoriesContainer>
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
                  <CategoryIcon></CategoryIcon>
                  <CategoryHeading>{category}</CategoryHeading>
                </CategoryCard>
              ))}
            </>
          )}
        />
      </CategoriesContainer>
      <CloseButton onPress={() => closeModal()}>
        <Text color="red">CLOSE</Text>
      </CloseButton>
    </ModalContainer>
  );
};

const CategoriesContainer = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
  padding: 12,
  borderBottomWidth: 1,
  borderColor: 'white',
});

const CategoryCard = styled(View, {
  alignItems: 'center',
  gap: 4,
});

const CategoryIcon = styled(View, {
  width: 32,
  height: 32,
  borderWidth: 1,
  borderColor: 'blue',
});
const CategoryHeading = styled(Text, {});

const CloseButton = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
});

export default CategoryModal;

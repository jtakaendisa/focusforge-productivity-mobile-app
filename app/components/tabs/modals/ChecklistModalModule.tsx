import { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { Text, View, styled } from 'tamagui';

import { ChecklistItem as ChecklistItemType } from '@/app/entities';
import { SCREEN_HEIGHT } from '@/app/constants';
import { NewTaskData } from '@/app/newTask';
import CreateChecklistItem from '../tasks/CreateChecklistItem';
import ChecklistItem from '../tasks/ChecklistItem';

interface Props {
  control: Control<NewTaskData>;
  checklist: ChecklistItemType[];
  closeModal: () => void;
}

const ChecklistModalModule = ({ control, checklist, closeModal }: Props) => {
  const listRef = useRef<FlashList<ChecklistItemType> | null>(null);
  const setChecklistRef = useRef<((...event: any[]) => void) | null>(null);

  const handleCreateItem = (newChecklistItem: ChecklistItemType) => {
    const updatedChecklist = [...checklist, newChecklistItem];
    setChecklistRef.current?.(updatedChecklist);
  };

  const handleDelete = (id: string) => {
    const filteredChecklistItems = checklist.filter(
      (checklistItem) => checklistItem.id !== id
    );
    setChecklistRef.current?.(filteredChecklistItems);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Create sub tasks</HeadingText>
      </HeadingContainer>
      <Controller
        control={control}
        name="checklist"
        render={({ field: { onChange, value } }) => {
          setChecklistRef.current = onChange;
          return (
            <MainContent>
              <AnimatedFlashList
                ref={listRef}
                data={value}
                renderItem={({ item }) => (
                  <ChecklistItem listItem={item} onDelete={handleDelete} />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparator}
                estimatedItemSize={46}
                ListHeaderComponent={() => (
                  <CreateChecklistItem setChecklist={handleCreateItem} />
                )}
                showsVerticalScrollIndicator={false}
              />
            </MainContent>
          );
        }}
      />
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
  height: SCREEN_HEIGHT / 3,
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

const ItemSeparator = styled(View, {
  height: 6,
});

export default ChecklistModalModule;

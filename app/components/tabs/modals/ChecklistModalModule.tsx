import { useRef } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { Text, View, getTokenValue, styled } from 'tamagui';
import { zodResolver } from '@hookform/resolvers/zod';

import { Activity, ChecklistItem as ChecklistItemType, Task } from '@/app/entities';
import { SCREEN_HEIGHT } from '@/app/constants';
import { NewTaskData } from '@/app/newTask';
import CreateChecklistItem from '../tasks/CreateChecklistItem';
import ChecklistItem from '../tasks/ChecklistItem';
import CheckableChecklistItem from '../tasks/CheckableChecklistItem';
import { useTaskStore } from '@/app/store';
import { checklistSchema } from '@/app/validationSchemas';

interface Props {
  isForm?: boolean;
  control?: Control<NewTaskData>;
  activities?: Activity[];
  taskId?: string;
  checklist: ChecklistItemType[];
  closeModal: () => void;
}

const ChecklistModalModule = ({
  isForm,
  control,
  activities,
  taskId,
  checklist,
  closeModal,
}: Props) => {
  const setTasks = useTaskStore((s) => s.setTasks);

  const listRef = useRef<FlashList<ChecklistItemType> | null>(null);
  const setChecklistRef = useRef<((...event: any[]) => void) | null>(null);

  const { control: checklistControl, watch } = useForm<{
    checklist: ChecklistItemType[];
  }>({
    defaultValues: { checklist },
    resolver: zodResolver(checklistSchema),
  });

  const { checklist: watchChecklist } = watch();

  const handleCreateItem = (newChecklistItem: ChecklistItemType) => {
    const updatedChecklist = [...checklist, newChecklistItem];
    setChecklistRef.current?.(updatedChecklist);
  };

  const handleDelete = (id: string) => {
    if (!checklist?.length) return;

    const filteredChecklistItems = checklist.filter(
      (checklistItem) => checklistItem.id !== id
    );
    setChecklistRef.current?.(filteredChecklistItems);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const handleCheck = (id: string) => {
    if (!activities) return;

    const updatedChecklist = watchChecklist.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isCompleted: !item.isCompleted,
        };
      } else {
        return item;
      }
    });

    setChecklistRef.current?.(updatedChecklist);

    const allCompleted = updatedChecklist.every((item) => item.isCompleted);

    const updatedTasks = activities.map((task) => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          isCompleted: allCompleted ? true : false,
          checklist: updatedChecklist,
        };
        return updatedTask;
      } else {
        return task;
      }
    });

    setTasks(updatedTasks);
  };

  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>{isForm ? 'Create sub tasks' : 'Sub Tasks'}</HeadingText>
      </HeadingContainer>
      <Controller
        control={control || (checklistControl as any)}
        name="checklist"
        render={({ field: { onChange, value } }) => {
          setChecklistRef.current = onChange;
          return (
            <MainContent>
              <AnimatedFlashList
                ref={listRef}
                data={value}
                renderItem={({ item }) =>
                  isForm ? (
                    <ChecklistItem listItem={item} onDelete={handleDelete} />
                  ) : (
                    <CheckableChecklistItem listItem={item} onCheck={handleCheck} />
                  )
                }
                keyExtractor={(item) => item.id}
                estimatedItemSize={46}
                ListHeaderComponent={() =>
                  isForm ? (
                    <CreateChecklistItem setChecklist={handleCreateItem} />
                  ) : null
                }
                showsVerticalScrollIndicator={false}
              />
            </MainContent>
          );
        }}
      />
      <CloseButton onPress={closeModal}>
        <ButtonText color={customRed1}>CLOSE</ButtonText>
      </CloseButton>
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

export default ChecklistModalModule;

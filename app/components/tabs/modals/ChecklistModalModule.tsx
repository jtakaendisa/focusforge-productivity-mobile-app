import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { SCREEN_HEIGHT } from '@/app/constants';
import {
  Activity,
  ChecklistItem as ChecklistItemType,
  NewActivityData,
} from '@/app/entities';
import { useActivityStore } from '@/app/store';
import CheckableChecklistItem from '../tasks/CheckableChecklistItem';
import ChecklistItem from '../tasks/ChecklistItem';
import CreateChecklistItem from '../tasks/CreateChecklistItem';

interface Props {
  isForm?: boolean;
  control?: Control<NewActivityData>;
  activities?: Activity[];
  taskId?: string;
  checklist?: ChecklistItemType[];
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
  const setActivities = useActivityStore((s) => s.setActivities);

  const [localChecklist, setLocalChecklist] = useState<ChecklistItemType[] | undefined>(
    checklist
  );

  const listRef = useRef<FlashList<ChecklistItemType> | null>(null);
  const setChecklistRef = useRef<((...event: any[]) => void) | null>(null);

  const handleCreateItem = (newChecklistItem: ChecklistItemType) => {
    const updatedChecklist = checklist
      ? [...checklist, newChecklistItem]
      : [newChecklistItem];
    if (control) {
      setChecklistRef.current?.(updatedChecklist);
    } else {
      setLocalChecklist(updatedChecklist);
    }
  };

  const handleDelete = (id: string) => {
    if (!checklist?.length) return;

    const filteredChecklistItems = checklist.filter(
      (checklistItem) => checklistItem.id !== id
    );

    if (control) {
      setChecklistRef.current?.(
        !!filteredChecklistItems.length ? filteredChecklistItems : undefined
      );
    } else {
      setLocalChecklist(filteredChecklistItems);
    }
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const handleCheck = (id: string) => {
    const updatedChecklist = localChecklist?.map((item) =>
      item.id === id
        ? {
            ...item,
            isCompleted: !item.isCompleted,
          }
        : item
    );
    setLocalChecklist(updatedChecklist);

    const allChecklistItemsCompleted = updatedChecklist?.every(
      (item) => item.isCompleted
    );

    const updatedTasks = activities?.map((activity) =>
      activity.id === taskId
        ? {
            ...activity,
            checklist: updatedChecklist,
            isCompleted: allChecklistItemsCompleted ? true : false,
          }
        : activity
    );

    if (updatedTasks) {
      setActivities(updatedTasks);
    }
  };

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>{isForm ? 'Create sub tasks' : 'Sub Tasks'}</HeadingText>
      </HeadingContainer>
      <MainContent>
        {control ? (
          <Controller
            control={control}
            name="checklist"
            render={({ field: { onChange, value } }) => {
              setChecklistRef.current = onChange;
              return (
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
              );
            }}
          />
        ) : (
          <AnimatedFlashList
            ref={listRef}
            data={localChecklist}
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
              isForm ? <CreateChecklistItem setChecklist={handleCreateItem} /> : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </MainContent>
      <CloseButton onPress={closeModal}>
        <ButtonText color="$customRed1">CLOSE</ButtonText>
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

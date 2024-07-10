import { useRef } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { Priority } from '@/app/entities';
import { NewTaskData } from '@/app/newTask';
import PriorityButton from './PriorityButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { prioritySchema } from '@/app/validationSchemas';
import { getTokenValue } from 'tamagui';

interface Props {
  currentPriority: Priority;
  isForm?: boolean;
  control?: Control<NewTaskData>;
  closeModal: () => void;
  setPriority?: (...event: any[]) => void;
}

const priorities = ['Low', 'Normal', 'High'] as const;

const PriorityModalModule = ({
  isForm,
  control,
  currentPriority,
  setPriority,
  closeModal,
}: Props) => {
  const previousPriorityRef = useRef<Priority>(currentPriority);
  const setPriorityRef = useRef<((...event: any[]) => void) | null>(null);

  const { control: priorityControl, watch } = useForm<{
    priority: Priority;
  }>({
    defaultValues: { priority: currentPriority },
    resolver: zodResolver(prioritySchema),
  });

  const { priority: watchPriority } = watch();

  const handleSelect = (priority: Priority) => {
    setPriorityRef.current?.(priority);
    if (!isForm) {
      setPriority?.(priority);
    }
  };

  const handleCancel = () => {
    setPriorityRef.current?.(previousPriorityRef.current);
    if (!isForm) {
      console.log('here now', previousPriorityRef.current);
      setPriority?.(previousPriorityRef.current);
    }
    closeModal();
  };

  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Set a priority</HeadingText>
      </HeadingContainer>
      <MainContent>
        <PrioritiesRow>
          <Controller
            control={control || (priorityControl as any)}
            name="priority"
            render={({ field: { onChange } }) => {
              setPriorityRef.current = onChange;
              return (
                <>
                  {priorities.map((priority) => (
                    <PriorityButton
                      key={priority}
                      priority={priority}
                      currentPriority={watchPriority || currentPriority}
                      onChange={handleSelect}
                    />
                  ))}
                </>
              );
            }}
          />
        </PrioritiesRow>
        <PriorityInfo>
          <Text color={customGray1}>
            Higher priority activities will be displayed higher in the list.
          </Text>
        </PriorityInfo>
      </MainContent>
      <ButtonsContainer>
        <Button onPress={handleCancel}>
          <Text>CANCEL</Text>
        </Button>
        <Button onPress={closeModal}>
          <ButtonText color={customRed1}>OK</ButtonText>
        </Button>
      </ButtonsContainer>
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
  justifyContent: 'center',
  alignItems: 'center',
  gap: 16,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const PrioritiesRow = styled(View, {
  flexDirection: 'row',
  borderRadius: 12,
  overflow: 'hidden',
});

const PriorityInfo = styled(View, {
  padding: 8,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default PriorityModalModule;

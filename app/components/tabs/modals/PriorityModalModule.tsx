import { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { Priority } from '@/app/entities';
import { NewTaskData } from '@/app/newTask';
import PriorityButton from './PriorityButton';

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

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Set a priority</HeadingText>
      </HeadingContainer>
      <MainContent>
        <PrioritiesRow>
          {isForm ? (
            <Controller
              control={control}
              name="priority"
              render={({ field: { onChange } }) => {
                setPriorityRef.current = onChange;
                return (
                  <>
                    {priorities.map((priority) => (
                      <PriorityButton
                        key={priority}
                        priority={priority}
                        currentPriority={currentPriority}
                        onChange={onChange}
                      />
                    ))}
                  </>
                );
              }}
            />
          ) : (
            <>
              {priorities.map((priority) => (
                <PriorityButton
                  key={priority}
                  priority={priority}
                  currentPriority={currentPriority}
                  onChange={setPriority}
                />
              ))}
            </>
          )}
        </PrioritiesRow>
        <PriorityInfo>
          <Text color="#8C8C8C">
            Higher priority activities will be displayed higher in the list.
          </Text>
        </PriorityInfo>
      </MainContent>
      <ButtonsContainer>
        {isForm ? (
          <Button
            onPress={() => {
              setPriorityRef.current?.(previousPriorityRef.current);
              closeModal();
            }}
          >
            <Text>CANCEL</Text>
          </Button>
        ) : (
          <Button
            onPress={() => {
              setPriority?.(previousPriorityRef.current);
              closeModal();
            }}
          >
            <Text>CANCEL</Text>
          </Button>
        )}
        <Button onPress={closeModal}>
          <ButtonText color="#C73A57">OK</ButtonText>
        </Button>
      </ButtonsContainer>
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
  justifyContent: 'center',
  alignItems: 'center',
  gap: 16,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: '#262626',
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

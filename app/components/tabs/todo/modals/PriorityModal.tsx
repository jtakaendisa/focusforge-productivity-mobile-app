import { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { Priority } from '@/app/entities';
import { PriorityType } from '@/app/store';
import { NewTaskData } from '@/app/newTask';
import ModalContainer, { ModalHeading } from './ModalContainer';

interface Props {
  control: Control<NewTaskData>;
  dismissKeyboard?: boolean;
  currentPriority: Priority;
  closeModal: () => void;
}

const PriorityModal = ({
  control,
  currentPriority,
  dismissKeyboard,
  closeModal,
}: Props) => {
  const previousPriorityRef = useRef<Priority>(currentPriority);
  const restorePreviousPriorityRef = useRef<((...event: any[]) => void) | null>(null);

  return (
    <ModalContainer dismissKeyboard={dismissKeyboard} closeModal={closeModal}>
      <ModalHeading>
        <Text>Set a priority</Text>
      </ModalHeading>
      <PrioritiesContainer>
        <PrioritiesRow>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange } }) => {
              restorePreviousPriorityRef.current = onChange;
              return (
                <>
                  <PriorityButton
                    style={{
                      borderRightWidth: 1,
                      backgroundColor:
                        currentPriority === PriorityType.low ? 'red' : '#a5a3a3',
                    }}
                    onPress={() => onChange(PriorityType.low)}
                  >
                    <Text>{PriorityType.low}</Text>
                  </PriorityButton>
                  <PriorityButton
                    style={{
                      backgroundColor:
                        currentPriority === PriorityType.normal ? 'red' : '#a5a3a3',
                    }}
                    onPress={() => onChange(PriorityType.normal)}
                  >
                    <Text>{PriorityType.normal}</Text>
                  </PriorityButton>
                  <PriorityButton
                    style={{
                      borderLeftWidth: 1,
                      backgroundColor:
                        currentPriority === PriorityType.high ? 'red' : '#a5a3a3',
                    }}
                    onPress={() => onChange(PriorityType.high)}
                  >
                    <Text>{PriorityType.high}</Text>
                  </PriorityButton>
                </>
              );
            }}
          />
        </PrioritiesRow>
      </PrioritiesContainer>
      <PriorityInfo>
        <Text>Higher priority activities will be displayed higher in the list</Text>
      </PriorityInfo>
      <ButtonsContainer>
        <Button
          onPress={() => {
            restorePreviousPriorityRef.current?.(previousPriorityRef.current);
            closeModal();
          }}
        >
          <Text>CANCEL</Text>
        </Button>
        <Button onPress={() => closeModal()}>
          <Text color="red">OK</Text>
        </Button>
      </ButtonsContainer>
    </ModalContainer>
  );
};

const PrioritiesContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 24,
  paddingHorizontal: 8,
});

const PrioritiesRow = styled(View, {
  flexDirection: 'row',
  backgroundColor: '#a5a3a3',
  borderRadius: 12,
  overflow: 'hidden',
});

const PriorityButton = styled(View, {
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderColor: 'white',
});

const PriorityInfo = styled(View, {
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: 'white',
  padding: 8,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  padding: 8,
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
});

export default PriorityModal;

import { useMemo, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { NewActivityData, Priority } from '@/app/entities';
import PriorityButton from './PriorityButton';
import RippleButton from '../RippleButton';

interface Props {
  initialPriority: Priority;
  control?: Control<NewActivityData>;
  closeModal: () => void;
  onPrioritize?: (...event: any[]) => void;
}

const priorities = ['Low', 'Normal', 'High'] as const;

const PriorityModalModule = ({
  initialPriority,
  control,
  onPrioritize,
  closeModal,
}: Props) => {
  const [localPriority, setLocalPriority] = useState(initialPriority);

  const memoizedInitialPriority = useMemo(() => initialPriority, []);
  const setPriorityRef = useRef<((...event: any[]) => void) | null>(null);

  const handlePrioritySelect = (priority: Priority) => {
    if (control) {
      setPriorityRef.current?.(priority);
    } else {
      setLocalPriority(priority);
    }
  };

  const handleSelectionConfirm = () => {
    onPrioritize?.(localPriority);
    closeModal();
  };

  const handleSelectionCancel = () => {
    setPriorityRef.current?.(memoizedInitialPriority);
    onPrioritize?.(memoizedInitialPriority);
    closeModal();
  };

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Set a priority</HeadingText>
      </HeadingContainer>
      <MainContent>
        <PrioritiesRow>
          {control ? (
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
                        currentPriority={control._getWatch('priority')}
                        onChange={handlePrioritySelect}
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
                  currentPriority={localPriority}
                  onChange={handlePrioritySelect}
                />
              ))}
            </>
          )}
        </PrioritiesRow>
        <PriorityInfo>
          <Text color="$customGray1">
            Higher priority activities will be displayed higher in the list.
          </Text>
        </PriorityInfo>
      </MainContent>
      <ButtonsContainer>
        <RippleButton flex onPress={handleSelectionCancel}>
          <Button>
            <Text>CANCEL</Text>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={handleSelectionConfirm}>
          <Button>
            <ButtonText color="$customRed1">OK</ButtonText>
          </Button>
        </RippleButton>
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
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default PriorityModalModule;

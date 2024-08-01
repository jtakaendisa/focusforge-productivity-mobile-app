import { Text, View, styled } from 'tamagui';
import RippleButton from '../RippleButton';

interface Props {
  activityId: string;
  variant: 'activity' | 'habit' | 'task';
  onDelete: (id: string) => void;
  closeModal: () => void;
}

const generateMessageText = (variant: 'activity' | 'habit' | 'task') => {
  switch (variant) {
    case 'activity':
      return 'Delete Activity?';
    case 'habit':
      return 'Delete Habit?';
    case 'task':
      return 'Delete Task?';
  }
};

const DeleteModalModule = ({ activityId, variant, onDelete, closeModal }: Props) => {
  const handleDelete = () => {
    onDelete(activityId);
    closeModal();
  };

  return (
    <Container>
      <MainContent>
        <Message>{generateMessageText(variant)}</Message>
      </MainContent>
      <ButtonsContainer>
        <RippleButton flex onPress={closeModal}>
          <Button>
            <ButtonText>Cancel</ButtonText>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={handleDelete}>
          <Button>
            <ButtonText color="$customRed1">Delete</ButtonText>
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

const MainContent = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const Message = styled(Text, {
  fontSize: 16,
  color: '$customRed1',
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

export default DeleteModalModule;

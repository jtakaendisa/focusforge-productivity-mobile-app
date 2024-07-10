import { Text, View, getTokenValue, styled } from 'tamagui';

interface Props {
  taskId: string;
  deleteTask: (id: string) => void;
  closeModal: () => void;
}

const DeleteModalModule = ({ taskId, deleteTask, closeModal }: Props) => {
  const onDelete = () => {
    deleteTask(taskId);
    closeModal();
  };

  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <MainContent>
        <Message>Delete Task?</Message>
      </MainContent>
      <ButtonsContainer>
        <Button onPress={closeModal}>
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={onDelete}>
          <ButtonText color={customRed1}>Delete</ButtonText>
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
  width: '50%',
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default DeleteModalModule;

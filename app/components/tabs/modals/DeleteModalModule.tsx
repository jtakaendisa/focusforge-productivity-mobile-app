import { Text, View, styled } from 'tamagui';

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
          <ButtonText color="#C73A57">Delete</ButtonText>
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

const MainContent = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const Message = styled(Text, {
  fontSize: 16,
  color: '#C73A57',
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

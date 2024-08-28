import { styled, View, Text } from 'tamagui';
import RippleButton from '../RippleButton';

interface Props {
  closeModal: () => void;
  onAbort: () => void;
}

const AbortActionModalModule = ({ closeModal, onAbort }: Props) => {
  return (
    <Container>
      <MainContent>
        <MessageText>Discard the new habit?</MessageText>
      </MainContent>
      <ButtonsContainer>
        <RippleButton flex onPress={closeModal}>
          <Button>
            <ButtonText>Cancel</ButtonText>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={onAbort}>
          <Button>
            <ButtonText color="$customRed1">Discard</ButtonText>
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

const MessageText = styled(Text, {
  fontSize: 16,
  color: '$customGray1',
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

export default AbortActionModalModule;

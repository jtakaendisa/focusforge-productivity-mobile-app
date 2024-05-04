import { ReactNode } from 'react';
import { Keyboard } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { View, styled } from 'tamagui';

interface Props {
  children: ReactNode;
  dismissKeyboard?: boolean;
  closeModal: () => void;
}

const ModalContainer = ({ children, dismissKeyboard, closeModal }: Props) => {
  return (
    <Container onLayout={() => dismissKeyboard && Keyboard.dismiss()}>
      <AnimatedBackdrop
        entering={FadeIn}
        exiting={FadeOut}
        onPress={() => closeModal()}
      />
      <AnimatedModal entering={FadeInDown} exiting={FadeOutDown}>
        {children}
      </AnimatedModal>
    </Container>
  );
};

const Container = styled(View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
});

const Backdrop = styled(View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1,
});

const Modal = styled(View, {
  width: '80%',
  padding: 16,
  paddingTop: 0,
  borderRadius: 12,
  zIndex: 2,
  backgroundColor: 'gray',
});

export const ModalHeading = styled(View, {
  alignItems: 'center',
  padding: 8,
  borderBottomWidth: 1,
  borderColor: 'white',
});

const AnimatedBackdrop = Animated.createAnimatedComponent(Backdrop);
const AnimatedModal = Animated.createAnimatedComponent(Modal);

export default ModalContainer;

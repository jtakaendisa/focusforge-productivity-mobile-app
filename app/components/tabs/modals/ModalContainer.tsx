import { ReactNode, useEffect } from 'react';
import { Keyboard, Modal } from 'react-native';
import { View, styled } from 'tamagui';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  transparentBackdrop?: boolean;
  dismissKeyboard?: boolean;
  closeModal: () => void;
}

const ModalContainer = ({
  children,
  isOpen,
  transparentBackdrop,
  dismissKeyboard,
  closeModal,
}: Props) => {
  useEffect(() => {
    if (!dismissKeyboard) return;

    Keyboard.dismiss();
  }, [dismissKeyboard]);

  return (
    <Modal
      onRequestClose={closeModal}
      visible={isOpen}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <MainContainer>
        <Backdrop onPress={closeModal} isTransparent={transparentBackdrop} />
        {children}
      </MainContainer>
    </Modal>
  );
};

const MainContainer = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Backdrop = styled(View, {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: '$customBlack3',
  variants: {
    isTransparent: {
      true: {
        backgroundColor: 'transparent',
      },
    },
  } as const,
});

export default ModalContainer;

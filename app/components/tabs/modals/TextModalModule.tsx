import { NewActivityData } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { useMemo, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { Text, View, styled } from 'tamagui';
import RippleButton from '../RippleButton';

interface Props {
  control: Control<NewActivityData>;
  name: 'title' | 'note';
  initialText?: string;
  closeModal: () => void;
}

const TextModalModule = ({ control, name, initialText, closeModal }: Props) => {
  const memoizedInitialText = useMemo(() => initialText, []);

  const { customGray7 } = useCustomColors();

  const setInputRef = useRef<((...event: any[]) => void) | null>(null);

  const handleCancel = () => {
    setInputRef.current?.(memoizedInitialText);
    closeModal();
  };

  const handleConfirm = () => {
    setInputRef.current?.(
      name === 'title'
        ? control._getWatch('title')?.trim()
        : control._getWatch('note')?.trim()
    );
    closeModal();
  };

  return (
    <Container>
      <MainContainer>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => {
            setInputRef.current = onChange;
            return (
              <TextInputField
                placeholder="Additional notes..."
                placeholderTextColor={customGray7}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                autoFocus
              />
            );
          }}
        />
      </MainContainer>
      <ButtonsContainer>
        <RippleButton flex onPress={handleCancel}>
          <Button>
            <ButtonText>CANCEL</ButtonText>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={handleConfirm}>
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

const MainContainer = styled(View, {
  margin: 16,
});

const TextInputField = styled(TextInput, {
  textAlignVertical: 'top',
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 8,
  padding: 6,
  //@ts-ignore
  color: 'white',
  fontSize: 16,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default TextModalModule;

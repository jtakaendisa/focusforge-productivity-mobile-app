import { useMemo, useRef } from 'react';
import { TextInput } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { Text, View, getTokenValue, styled } from 'tamagui';
import { NewActivityData } from '@/app/entities';

interface Props {
  control: Control<NewActivityData>;
  name: 'title' | 'note';
  initialText?: string;
  closeModal: () => void;
}

const TextModalModule = ({ control, name, initialText, closeModal }: Props) => {
  const memoizedInitialText = useMemo(() => initialText, []);
  const setInputRef = useRef<((...event: any[]) => void) | null>(null);

  const customGray7 = getTokenValue('$customGray7');

  const handleCancel = () => {
    setInputRef.current?.(memoizedInitialText);
    closeModal();
  };

  const handleConfirm = () => {
    setInputRef.current?.(
      name === 'title'
        ? control._getWatch('title').trim()
        : control._getWatch('note').trim()
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
        <Button onPress={handleCancel}>
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={handleConfirm}>
          <ButtonText color="$customRed1">OK</ButtonText>
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
  width: '50%',
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default TextModalModule;

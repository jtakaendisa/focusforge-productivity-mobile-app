import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { NewTaskData } from '@/app/newTask';

interface Props {
  control: Control<NewTaskData>;
  previousNote: string;
  closeModal: () => void;
}

const NoteModalModule = ({ control, previousNote, closeModal }: Props) => {
  const previousNoteRef = useRef<string>(previousNote);
  const clearInputRef = useRef<((...event: any[]) => void) | null>(null);

  return (
    <Container>
      <MainContainer>
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, onBlur, value } }) => {
            clearInputRef.current = onChange;
            return (
              <NoteInputField
                placeholder="Additional notes..."
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
        <Button
          onPress={() => {
            clearInputRef.current?.(previousNoteRef.current);
            closeModal();
          }}
        >
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={closeModal}>
          <ButtonText color="#C73A57">OK</ButtonText>
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

const MainContainer = styled(View, {
  margin: 16,
});

const NoteInputField = styled(TextInput, {
  textAlignVertical: 'top',
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 8,
  padding: 6,
  placeholderTextColor: '#dddddd',
  //@ts-ignore
  color: 'white',
  fontSize: 16,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  borderTopWidth: 1,
  borderColor: '#262626',
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

export default NoteModalModule;

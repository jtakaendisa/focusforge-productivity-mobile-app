import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { Text, View, styled } from 'tamagui';

import { NewTaskData } from '@/app/newTask';
import ModalContainer from './ModalContainer';

interface Props {
  control: Control<NewTaskData>;
  previousNote: string;
  closeModal: () => void;
}

const NoteModal = ({ control, previousNote, closeModal }: Props) => {
  const previousNoteRef = useRef<string>(previousNote);
  const clearInputRef = useRef<((...event: any[]) => void) | null>(null);

  return (
    <ModalContainer closeModal={closeModal}>
      <NoteContainer>
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
      </NoteContainer>
      <ButtonsContainer>
        <Button
          onPress={() => {
            clearInputRef.current?.(previousNoteRef.current);
            closeModal();
          }}
        >
          <Text>CANCEL</Text>
        </Button>
        <Button onPress={() => closeModal()}>
          <Text color="red">OK</Text>
        </Button>
      </ButtonsContainer>
    </ModalContainer>
  );
};

const NoteContainer = styled(View, {
  marginTop: 16,
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
  padding: 8,
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
});

export default NoteModal;

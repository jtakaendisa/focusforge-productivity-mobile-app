import { useState } from 'react';
import { TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { styled } from 'tamagui';

import { ChecklistItem } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import PlusSvg from '../../icons/PlusSvg';

interface Props {
  setChecklist: (checklistItem: ChecklistItem) => void;
}

const CreateTaskItem = ({ setChecklist }: Props) => {
  const [title, setTitle] = useState('');

  const { customRed1 } = useCustomColors();

  const handleSubmit = () => {
    if (!title.length) return;

    const newFormattedChecklistItem = {
      id: uuid.v4() as string,
      title,
      isCompleted: false,
    };

    setChecklist(newFormattedChecklistItem);
    setTitle('');
  };

  return (
    <Container>
      <PlusSvg size={22} fill={customRed1} />
      <TitleInputField
        placeholder="Enter Title..."
        value={title}
        onChangeText={setTitle}
        onEndEditing={handleSubmit}
      />
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  height: 64,
  paddingHorizontal: 12,
  backgroundColor: '$customBlack1',
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const TitleInputField = styled(TextInput, {
  flex: 1,
  placeholderTextColor: 'white',
  // @ts-ignore
  fontSize: 16,
  color: 'white',
});

export default CreateTaskItem;

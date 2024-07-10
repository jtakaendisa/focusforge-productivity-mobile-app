import { useState } from 'react';
import { TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import Svg, { Path } from 'react-native-svg';
import { getTokenValue, styled } from 'tamagui';

import { ChecklistItem } from '@/app/entities';

interface Props {
  setChecklist: (checklistItem: ChecklistItem) => void;
}

const SVG_SIZE = 24;

const CreateTaskItem = ({ setChecklist }: Props) => {
  const [title, setTitle] = useState('');

  const customRed1 = getTokenValue('$customRed1');

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
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
        <Path
          d="M11.1538 1.15385C11.1538 0.514423 10.6394 0 10 0C9.36058 0 8.84615 0.514423 8.84615 1.15385V8.84615H1.15385C0.514423 8.84615 0 9.36058 0 10C0 10.6394 0.514423 11.1538 1.15385 11.1538H8.84615V18.8462C8.84615 19.4856 9.36058 20 10 20C10.6394 20 11.1538 19.4856 11.1538 18.8462V11.1538H18.8462C19.4856 11.1538 20 10.6394 20 10C20 9.36058 19.4856 8.84615 18.8462 8.84615H11.1538V1.15385Z"
          fill={customRed1}
        />
      </Svg>
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

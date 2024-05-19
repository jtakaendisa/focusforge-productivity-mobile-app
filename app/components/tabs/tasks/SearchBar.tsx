import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Text, View, styled } from 'tamagui';

import { useTaskStore } from '@/app/store';

const SearchBar = () => {
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);

  const [textInput, setTextInput] = useState('');

  const searchInputRef = useRef<TextInput>(null);

  const handleSearch = () => {
    if (!textInput.length) return;

    setSearchQuery(textInput.toLowerCase().trim());
  };

  const handleClearSearch = () => {
    searchInputRef.current?.clear();
    setSearchQuery('');
  };

  return (
    <Container>
      <SearchField
        ref={searchInputRef}
        placeholder="Search for task..."
        onChangeText={setTextInput}
        value={textInput}
        onEndEditing={handleSearch}
      />
      <ButtonContainer onPress={handleClearSearch}>
        <ButtonText>Clear</ButtonText>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  margin: 10,
});

const SearchField = styled(TextInput, {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 50,
  //@ts-ignore
  fontSize: 16,
});

const ButtonText = styled(Text, {
  fontSize: 16,
  color: 'black',
});

const ButtonContainer = styled(View, {
  padding: 10,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 50,
});

export default SearchBar;

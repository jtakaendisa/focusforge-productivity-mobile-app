import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Text, View, styled } from 'tamagui';

import { useTodoStore } from '@/app/store';

const SearchBar = () => {
  const setSearchQuery = useTodoStore((s) => s.setSearchQuery);

  const searchInputRef = useRef<TextInput>(null);

  // Using useRef to capture input to avoid focus loss on re-render
  const handleSearch = () => {
    if (!searchInputRef?.current?.state) return;

    setSearchQuery((searchInputRef.current.state as string).toLowerCase().trim());
  };

  const Container = styled(View, {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 10,
  });

  const SearchInput = styled(TextInput, {
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

  return (
    <Container>
      <SearchInput
        ref={searchInputRef}
        placeholder="Search for task..."
        onChangeText={(e) => (searchInputRef.current!.state = e)}
        onEndEditing={handleSearch}
      />
      <ButtonContainer onPress={() => setSearchQuery('')}>
        <ButtonText>Clear</ButtonText>
      </ButtonContainer>
    </Container>
  );
};

export default SearchBar;

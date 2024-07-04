import { SCREEN_WIDTH } from '@/app/constants';
import { TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, View, styled } from 'tamagui';

interface Props {
  height: number;
  isCurrentScreenHome: boolean;
  closeSearchBar: () => void;
}

const SearchBar = ({ height, isCurrentScreenHome, closeSearchBar }: Props) => {
  // const searchQuery = useAppStore((s) => s.searchQuery);
  // const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  // const setSearchQuery = useTaskStore((s) => s.setSearchQuery);

  // const [textInput, setTextInput] = useState('');

  // const searchInputRef = useRef<TextInput>(null);

  // const handleSearch = () => {
  //   if (!textInput.length) return;

  //   setSearchQuery(textInput.toLowerCase().trim());
  // };

  // const handleClearSearch = () => {
  //   searchInputRef.current?.clear();
  //   setSearchQuery('');
  // };

  return (
    <AnimatedContainer height={height} entering={FadeIn} exiting={FadeOut}>
      {/* <SearchField
        ref={searchInputRef}
        placeholder="Search for task..."
        onChangeText={setTextInput}
        value={textInput}
        onEndEditing={handleSearch}
      />
      <ButtonContainer onPress={handleClearSearch}>
        <ButtonText>Clear</ButtonText>
      </ButtonContainer> */}
      <FilterRow>
        <ActivityTypeButton width={SCREEN_WIDTH / 3}>
          <Text>All</Text>
          <Text>^</Text>
        </ActivityTypeButton>
        <CategoryButton>
          <Text color="#8C8C8C">Select a category</Text>
        </CategoryButton>
      </FilterRow>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  justifyContent: 'flex-end',
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const FilterRow = styled(View, {
  flex: 1,
  flexDirection: 'row',
});

const ActivityTypeButton = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  borderRightWidth: 1,
  borderColor: '#262626',
});

const CategoryButton = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
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

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default SearchBar;

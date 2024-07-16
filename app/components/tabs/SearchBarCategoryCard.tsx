import { Category } from '@/app/entities';
import { styled, View, Text } from 'tamagui';
import CategoryIcon from './CategoryIcon';
import RippleButton from './RippleButton';
import CircularCheckbox from './CircularCheckbox';
import { useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props {
  category: Category;
  isSelected: boolean;
  onSelect: (category: Category) => void;
}

const SearchBarCategoryCard = ({ category, isSelected, onSelect }: Props) => {
  const isChecked = useSharedValue(isSelected ? 1 : 0);

  const handleSelect = () => onSelect(category);

  useEffect(() => {
    isChecked.value = isSelected ? 1 : 0;
  }, [isSelected]);

  return (
    <RippleButton onPress={handleSelect}>
      <Container>
        <InnerRow>
          <CategoryContainer>
            <CategoryIcon category={category} />
          </CategoryContainer>
          <TitleText>{category}</TitleText>
        </InnerRow>
        <CircularCheckbox isChecked={isChecked} />
      </Container>
    </RippleButton>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 54,
  paddingHorizontal: 12,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const InnerRow = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 32,
  height: 32,
  backgroundColor: 'gray',
  borderRadius: 8,
});

const TitleText = styled(Text, {
  fontSize: 16,
});

export default SearchBarCategoryCard;

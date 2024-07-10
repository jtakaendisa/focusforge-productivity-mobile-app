import { Category } from '@/app/entities';
import { styled, View, Text } from 'tamagui';
import CategoryIcon from './CategoryIcon';
import RippleButton from './RippleButton';
import CircularCheckbox from './CircularCheckbox';
import { useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props {
  item: {
    name: Category;
    isSelected: boolean;
  };
  onSelect: (name: Category) => void;
}

const SearchBarCategoryCard = ({ item, onSelect }: Props) => {
  const { name, isSelected } = item;

  const isChecked = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    isChecked.value = isSelected ? 1 : 0;
  }, [isSelected]);

  return (
    <RippleButton noFade onPress={() => onSelect(name)}>
      <Container>
        <InnerRow>
          <CategoryContainer>
            <CategoryIcon category={name} />
          </CategoryContainer>
          <TitleText>{name}</TitleText>
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

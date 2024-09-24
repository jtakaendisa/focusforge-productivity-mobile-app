import { categoryColorMap } from '@/app/constants';
import { Category } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';
import CategoryIcon from './CategoryIcon';
import CircularCheckbox from './CircularCheckbox';
import RippleButton from './RippleButton';

interface Props {
  category: Category;
  isSelected: boolean;
  isLastIndex: boolean;
  onSelect: (category: Category) => void;
}

const SearchBarCategoryCard = ({
  category,
  isSelected,
  isLastIndex,
  onSelect,
}: Props) => {
  const isChecked = useSharedValue(isSelected ? 1 : 0);

  const { customBlack1 } = useCustomColors();

  const handleSelect = () => onSelect(category);

  useEffect(() => {
    isChecked.value = isSelected ? 1 : 0;
  }, [isSelected]);

  return (
    <RippleButton onPress={handleSelect}>
      <Container isBordered={!isLastIndex}>
        <InnerRow>
          <CategoryContainer backgroundColor={categoryColorMap[category]}>
            <CategoryIcon category={category} fill={customBlack1} />
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
  variants: {
    isBordered: {
      true: {
        borderColor: '$customGray2',
      },
      false: {
        borderColor: 'transparent',
      },
    },
  } as const,
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
  borderRadius: 8,
});

const TitleText = styled(Text, {
  fontSize: 16,
});

export default SearchBarCategoryCard;

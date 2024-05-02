import { LayoutChangeEvent } from 'react-native';
import { styled, View, Text } from 'tamagui';

interface Props {
  item: {
    weekday: string;
    date: Date;
  };
  index: number;
  value: Date;
  itemWidths: {
    [key: number]: number;
  };
  onPress: (date: Date) => void;
}

const CalendarCard = ({ item, index, value, itemWidths, onPress }: Props) => {
  const isActive = value?.toDateString() === item.date.toDateString();

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    itemWidths[index] = width;
  };

  return (
    <ItemContainer
      onLayout={handleLayout}
      onPress={() => onPress(item.date)}
      isActive={isActive}
    >
      <ItemWeekday isActive={isActive}>{item.weekday}</ItemWeekday>
      <ItemDate isActive={isActive}>{item.date.getDate()}</ItemDate>
    </ItemContainer>
  );
};

const ItemContainer = styled(View, {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  height: 50,
  marginHorizontal: 4,
  paddingVertical: 6,
  paddingHorizontal: 4,
  borderWidth: 1,
  borderColor: '#e3e3e3',
  borderRadius: 8,
  variants: {
    isActive: {
      true: {
        backgroundColor: '#111',
        borderColor: '#111',
      },
    },
  } as const,
});

const ItemWeekday = styled(Text, {
  fontSize: 12,
  fontWeight: '500',
  color: '#737373',
  marginBottom: 4,
  variants: {
    isActive: {
      true: {
        color: 'white',
      },
    },
  } as const,
});

const ItemDate = styled(Text, {
  fontSize: 14,
  fontWeight: '600',
  color: '#111',
  variants: {
    isActive: {
      true: {
        color: 'white',
      },
    },
  } as const,
});

export default CalendarCard;

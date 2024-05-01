import { styled, View, Text } from 'tamagui';

interface Props {
  item: {
    weekday: string;
    date: Date;
  };
  value: Date;
  onPress: (date: Date) => void;
}

const CalendarCard = ({ item, value, onPress }: Props) => {
  const isActive = value?.toDateString() === item.date.toDateString();

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

  return (
    <ItemContainer onPress={() => onPress(item.date)} isActive={isActive}>
      <ItemWeekday isActive={isActive}>{item.weekday}</ItemWeekday>
      <ItemDate isActive={isActive}>{item.date.getDate()}</ItemDate>
    </ItemContainer>
  );
};

export default CalendarCard;

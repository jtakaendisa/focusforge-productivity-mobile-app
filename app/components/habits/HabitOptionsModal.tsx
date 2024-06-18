import { MutableRefObject } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text } from 'tamagui';

import { Habit } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import HabitOptionIcon from './HabitOptionIcon';
import CategoryIcon from '../tabs/CategoryIcon';
import FrequencyBadge from './FrequencyBadge';

interface Props {
  habitOptionsRef: MutableRefObject<BottomSheetModalMethods | null>;
  selectedHabit: Habit | null;
  onDelete: () => void;
  onNavigate: (activeTab: string, habitId: string) => void;
}

const options = [
  {
    heading: 'Calendar',
    icon: 'calendar',
  },
  {
    heading: 'Statistics',
    icon: 'statistics',
  },
  {
    heading: 'Edit',
    icon: 'edit',
  },
  {
    heading: 'Delete',
    icon: 'delete',
  },
] as const;

const HabitOptionsModal = ({
  habitOptionsRef,
  selectedHabit,
  onDelete,
  onNavigate,
}: Props) => {
  return (
    <BottomSheetModal
      ref={habitOptionsRef}
      backgroundStyle={{ backgroundColor: '#1C1C1C' }}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView>
        <TopRow>
          <DetailsContainer>
            <TitleText>{selectedHabit?.title}</TitleText>
            {!!selectedHabit?.note.length && (
              <Text>{toTruncatedText(selectedHabit.note, 12)}</Text>
            )}
            {selectedHabit?.frequency && (
              <FrequencyBadge frequency={selectedHabit.frequency} />
            )}
          </DetailsContainer>
          <CategoryContainer>
            {selectedHabit?.category && (
              <CategoryIcon category={selectedHabit.category} />
            )}
          </CategoryContainer>
        </TopRow>
        {options.map((option, index) => {
          const { heading, icon } = option;

          const isBordered = index === options.length - 2;
          const isLastIndex = index === options.length - 1;

          const fill = isLastIndex ? '#C73A57' : '#8C8C8C';

          return (
            <View key={heading}>
              {selectedHabit?.id && (
                <CardContainer
                  onPress={() =>
                    isLastIndex ? onDelete() : onNavigate(icon, selectedHabit.id)
                  }
                  isBordered={isBordered}
                >
                  <IconContainer>
                    <HabitOptionIcon name={icon} fill={fill} />
                  </IconContainer>
                  <CardTextContainer>
                    <CardTitle isRed={isLastIndex}>{heading}</CardTitle>
                  </CardTextContainer>
                </CardContainer>
              )}
            </View>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
);

const TopRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const DetailsContainer = styled(View, {
  gap: 4,
});

const TitleText = styled(Text, {
  fontSize: 18.5,
  fontWeight: 'bold',
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: 'gray',
  borderRadius: 8,
});

const CardContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderColor: '#262626',
  variants: {
    isBordered: {
      true: {
        borderBottomWidth: 1,
      },
      false: {
        borderBottomWidth: 0,
      },
    },
  } as const,
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 28,
  height: 28,
});

const CardTextContainer = styled(View, {
  flex: 1,
  paddingHorizontal: 16,
});

const CardTitle = styled(Text, {
  fontSize: 15.5,
  variants: {
    isRed: {
      true: {
        color: '#C73A57',
      },
      false: {
        color: '#fff',
      },
    },
  } as const,
});

export default HabitOptionsModal;

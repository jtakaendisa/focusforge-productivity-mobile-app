import { MutableRefObject } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text } from 'tamagui';

import { Habit, Task } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import HabitOptionIcon from './HabitOptionIcon';
import CategoryIcon from '../tabs/CategoryIcon';
import FrequencyBadge from './FrequencyBadge';

interface Props {
  mode: 'habit' | 'task';
  activityOptionsRef: MutableRefObject<BottomSheetModalMethods | null>;
  selectedActivity: Habit | Task | null;
  onDelete: (id?: string) => void;
  onNavigate: (activeTab: string, habitId: string) => void;
}

const ActivityOptionsModal = ({
  mode,
  activityOptionsRef,
  selectedActivity,
  onDelete,
  onNavigate,
}: Props) => {
  const options =
    mode === 'habit'
      ? (['calendar', 'statistics', 'edit', 'delete'] as const)
      : (['calendar', 'edit', 'delete'] as const);

  return (
    <BottomSheetModal
      ref={activityOptionsRef}
      backgroundStyle={{ backgroundColor: '#1C1C1C' }}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView>
        <TopRow>
          <DetailsContainer>
            <TitleText>{selectedActivity?.title}</TitleText>
            {!!selectedActivity?.note.length && (
              <Text>{toTruncatedText(selectedActivity.note, 12)}</Text>
            )}
            {selectedActivity?.frequency && (
              <FrequencyBadge frequency={selectedActivity.frequency} />
            )}
          </DetailsContainer>
          <CategoryContainer>
            {selectedActivity?.category && (
              <CategoryIcon category={selectedActivity.category} />
            )}
          </CategoryContainer>
        </TopRow>
        {options.map((option, index) => {
          const isLastIndex = index === options.length - 1;

          const fill = isLastIndex ? '#C73A57' : '#8C8C8C';

          return (
            <View key={option}>
              {selectedActivity?.id && (
                <CardContainer
                  onPress={() =>
                    isLastIndex
                      ? mode === 'habit'
                        ? onDelete()
                        : onDelete()
                      : onNavigate(option, selectedActivity.id)
                  }
                  isBordered={isLastIndex}
                >
                  <IconContainer>
                    <HabitOptionIcon name={option} fill={fill} />
                  </IconContainer>
                  <CardTextContainer>
                    <CardTitle isRed={isLastIndex}>{option}</CardTitle>
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
        borderTopWidth: 1,
      },
      false: {
        borderTopWidth: 0,
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
  textTransform: 'capitalize',
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

export default ActivityOptionsModal;

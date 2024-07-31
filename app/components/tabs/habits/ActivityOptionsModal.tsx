import { MutableRefObject } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { Activity } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';
import HabitOptionIcon from './HabitOptionIcon';
import CategoryIcon from '../CategoryIcon';
import FrequencyBadge from './FrequencyBadge';
import { TaskActiveTab } from '@/app/taskDetails';
import { HabitActiveTab } from '@/app/habitDetails';

interface Props {
  mode: 'habit' | 'recurring task';
  activityOptionsRef: MutableRefObject<BottomSheetModalMethods | null>;
  selectedActivity: Activity | null;
  onDelete: (id: string) => void;
  onNavigate: (activeTab: TaskActiveTab | HabitActiveTab, activityId: string) => void;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
);

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

  const customBlack1 = getTokenValue('$customBlack1');
  const customGray1 = getTokenValue('$customGray1');
  const customGray3 = getTokenValue('$customGray3');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <BottomSheetModal
      ref={activityOptionsRef}
      backgroundStyle={{ backgroundColor: customGray3 }}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView>
        <TopRow>
          <DetailsContainer>
            <TitleText>{selectedActivity?.title}</TitleText>
            {!!selectedActivity?.note?.length && (
              <Text>{toTruncatedText(selectedActivity.note, 12)}</Text>
            )}
            {selectedActivity?.frequency && (
              <FrequencyBadge frequency={selectedActivity.frequency} />
            )}
          </DetailsContainer>
          <CategoryContainer>
            {selectedActivity?.category && (
              <CategoryIcon category={selectedActivity.category} fill={customBlack1} />
            )}
          </CategoryContainer>
        </TopRow>
        {options.map((option, index) => {
          const isLastIndex = index === options.length - 1;

          const fill = isLastIndex ? customRed1 : customGray1;

          return (
            <View key={option}>
              {selectedActivity?.id && (
                <CardContainer
                  onPress={() =>
                    isLastIndex
                      ? onDelete(selectedActivity.id)
                      : onNavigate(
                          option as TaskActiveTab | HabitActiveTab,
                          selectedActivity.id
                        )
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

const TopRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
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
  borderColor: '$customGray2',
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
        color: '$customRed1',
      },
      false: {
        color: 'white',
      },
    },
  } as const,
});

export default ActivityOptionsModal;

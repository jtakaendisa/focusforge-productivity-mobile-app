import { MutableRefObject } from 'react';
import { router } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text } from 'tamagui';
import TaskFrequencyIcon from './TaskFrequencyIcon';

interface Props {
  frequencySelectorRef: MutableRefObject<BottomSheetModalMethods | null>;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
);

const options = [
  {
    heading: 'Habit',
    description:
      'Activity that repeats over time. It has detailed tracking and statistics.',
    icon: 'habit',
  },
  {
    heading: 'Task',
    description: 'Single instance activity without tracking over time.',
    icon: 'task',
  },
] as const;

const FrequencySelector = ({ frequencySelectorRef }: Props) => {
  const handleCreateTask = () => {
    router.push('/newTask');
  };

  return (
    <BottomSheetModal
      ref={frequencySelectorRef}
      backgroundStyle={{ backgroundColor: '#1C1C1C' }}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      backdropComponent={renderBackdrop}
      index={0}
      snapPoints={[200]}
      enablePanDownToClose
    >
      <BottomSheetView>
        {options.map(({ heading, description, icon }, index) => (
          <>
            <CardContainer key={heading}>
              <IconContainer style={{ backgroundColor: 'rgba(150, 44, 66, 0.25)' }}>
                <TaskFrequencyIcon name={icon} fill="#C73A57" />
              </IconContainer>
              <CardTextContainer>
                <CardHeading>{heading}</CardHeading>
                <CardDescription>{description}</CardDescription>
              </CardTextContainer>
              <IconContainer>
                <TaskFrequencyIcon name="proceed" fill="#8C8C8C" />
              </IconContainer>
            </CardContainer>
            {index === 0 && <Separator />}
          </>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const CardContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 44,
  borderRadius: 22,
});

const CardTextContainer = styled(View, {
  flex: 1,
  paddingHorizontal: 16,
});

const CardHeading = styled(Text, {
  fontSize: 15.5,
  fontWeight: '900',
});

const CardDescription = styled(Text, {
  fontSize: 12,
  color: '#d3d1d1',
});

const Separator = styled(View, {
  height: 1,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

export default FrequencySelector;

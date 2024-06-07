import { MutableRefObject } from 'react';
import { router, usePathname } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text } from 'tamagui';

import HabitOptionIcon from './HabitOptionIcon';

interface Props {
  habitOptionsRef: MutableRefObject<BottomSheetModalMethods | null>;
}

type Pathname = '/newTask' | '/newHabit';

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
);

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

const HabitOptionsModal = ({ habitOptionsRef }: Props) => {
  const currentPath = usePathname();

  const handleDelete = () => {};

  const navigateToHabitDetailsScreen = (activeTab: string) => {
    habitOptionsRef.current?.dismiss();

    router.push({
      pathname: '/',
      params: { origin: currentPath, activeTab },
    });
  };

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
        {options.map((option, index) => {
          const { heading, icon } = option;

          const isBordered = index === options.length - 2;
          const isLastIndex = index === options.length - 1;
          const fill = isLastIndex ? '#C73A57' : '#8C8C8C';

          return (
            <CardContainer
              key={heading}
              onPress={() =>
                isLastIndex ? handleDelete : navigateToHabitDetailsScreen(icon)
              }
              isBordered={isBordered}
            >
              <IconContainer>
                <HabitOptionIcon name={icon} fill={fill} />
              </IconContainer>
              <CardTextContainer>
                <CardHeading isLastIndex={isLastIndex}>{heading}</CardHeading>
              </CardTextContainer>
            </CardContainer>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

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

const CardHeading = styled(Text, {
  fontSize: 15.5,
  fontWeight: '900',
  variants: {
    isLastIndex: {
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

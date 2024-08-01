import { MutableRefObject } from 'react';
import { router, usePathname } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styled, View, Text, getTokenValue } from 'tamagui';

import ActivityTypeIcon from './ActivityTypeIcon';
import ArrowRightSvg from '../../icons/ArrowRightSvg';
import RippleButton from '../RippleButton';

interface Props {
  newActivityModalRef: MutableRefObject<BottomSheetModalMethods | null>;
}

type Pathname = '/newTask' | '/newHabit';

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
);

const options = [
  {
    heading: 'Habit',
    description:
      'Activity that repeats over time. It has detailed tracking and statistics.',
    icon: 'habit',
    pathname: '/newHabit',
    isRecurring: true,
  },
  {
    heading: 'Recurring Task',
    description: 'Activity that repeats over time without tracking or statistics.',
    icon: 'recurring task',
    pathname: '/newTask',
    isRecurring: true,
  },
  {
    heading: 'Task',
    description: 'Single instance activity without tracking over time.',
    icon: 'single task',
    pathname: '/newTask',
    isRecurring: false,
  },
] as const;

const NewActivityModal = ({ newActivityModalRef }: Props) => {
  const currentPath = usePathname();

  const navigateToNewActivityScreen = (pathname: Pathname, isRecurring: boolean) => {
    newActivityModalRef.current?.dismiss();

    if (pathname === '/newTask') {
      router.push({
        pathname,
        params: { isRecurring: isRecurring.toString(), origin: currentPath },
      });
    } else {
      router.push({ pathname, params: { origin: currentPath } });
    }
  };

  const customGray1 = getTokenValue('$customGray1');
  const customGray3 = getTokenValue('$customGray3');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <BottomSheetModal
      ref={newActivityModalRef}
      backgroundStyle={{ backgroundColor: customGray3 }}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView>
        {options.map((option, index) => {
          const { heading, description, icon, pathname, isRecurring } = option;
          const isLastIndex = index === options.length - 1;

          return (
            <RippleButton
              key={heading}
              onPress={() => navigateToNewActivityScreen(pathname, isRecurring)}
            >
              <CardContainer isBordered={!isLastIndex}>
                <IconContainer isTransparent={false}>
                  <ActivityTypeIcon name={icon} fill={customRed1} />
                </IconContainer>
                <CardTextContainer>
                  <CardHeading>{heading}</CardHeading>
                  <CardDescription>{description}</CardDescription>
                </CardTextContainer>
                <IconContainer>
                  <ArrowRightSvg fill={customGray1} />
                </IconContainer>
              </CardContainer>
            </RippleButton>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const CardContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
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
  },
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 44,
  borderRadius: 22,
  variants: {
    isTransparent: {
      true: {
        backgroundColor: 'transparent',
      },
      false: {
        backgroundColor: '$customRed6',
      },
    },
  } as const,
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
  color: '$customGray8',
});

export default NewActivityModal;

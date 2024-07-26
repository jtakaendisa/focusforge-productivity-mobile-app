import { useRef, useState } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { Control, Controller } from 'react-hook-form';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, Text, styled, getTokenValue } from 'tamagui';

import { Priority, Reminder } from '@/app/entities';
import { SCREEN_WIDTH, SCREEN_HEIGHT, TODAYS_DATE } from '@/app/constants';
import { toFormattedDateString } from '@/app/utils';
import { NewHabitData } from '@/app/newHabit';
import Switch from '../settings/Switch';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import RemindersModalModule from '../modals/RemindersModalModule';
import CalendarStartSvg from '../../icons/CalendarStartSvg';
import CalendarEndSvg from '../../icons/CalendarEndSvg';
import BellSvg from '../../icons/BellSvg';
import FlagSvg from '../../icons/FlagSvg';

interface Props {
  control: Control<NewHabitData>;
  currentPriority: Priority;
  startDate: Date;
  endDate?: Date;
  reminders: Reminder[];
}

const SVG_SIZE = 22;

const DurationListModule = ({
  control,
  currentPriority,
  startDate,
  endDate,
  reminders,
}: Props) => {
  const [modalState, setModalState] = useState({
    isRemindersOpen: false,
    isPriorityOpen: false,
  });
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);

  const { isRemindersOpen, isPriorityOpen } = modalState;

  const setStartDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    mode: 'start' | 'end'
  ) => {
    if (selectedDate) {
      if (mode === 'start') {
        setStartDateRef.current?.(selectedDate);
      } else {
        setEndDateRef.current?.(selectedDate);
      }
    }
  };

  const showDatePicker = (mode: 'start' | 'end') => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, date) => handleDateSelect(e, date, mode),
      is24Hour: true,
      minimumDate: TODAYS_DATE,
    });
  };

  const handleEndDateSelect = () => {
    if (isEndDateEnabled) {
      setEndDateRef.current?.();
    } else {
      showDatePicker('end');
    }
    setIsEndDateEnabled((prev) => !prev);
  };

  const toggleRemindersModal = () =>
    setModalState({ ...modalState, isRemindersOpen: !isRemindersOpen });

  const togglePriorityModal = () =>
    setModalState({ ...modalState, isPriorityOpen: !isPriorityOpen });

  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <Heading>When do you want to do it?</Heading>
      </HeadingContainer>

      <OptionContainer onPress={() => showDatePicker('start')}>
        <OptionInfo>
          <CalendarStartSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Start date</OptionTitle>
        </OptionInfo>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange } }) => {
            setStartDateRef.current = onChange;
            return (
              <OptionLabel>
                <LabelText>
                  {toFormattedDateString(startDate) ===
                  toFormattedDateString(TODAYS_DATE)
                    ? 'Today'
                    : toFormattedDateString(startDate)}
                </LabelText>
              </OptionLabel>
            );
          }}
        />
      </OptionContainer>
      <OptionContainer onPress={handleEndDateSelect}>
        <OptionInfo>
          <CalendarEndSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>End date</OptionTitle>
        </OptionInfo>
        <Row>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange } }) => {
              setEndDateRef.current = onChange;
              return (
                <>
                  {isEndDateEnabled && endDate && (
                    <AnimatedOptionLabel entering={FadeIn} exiting={FadeOut}>
                      <LabelText>
                        {toFormattedDateString(endDate) ===
                        toFormattedDateString(TODAYS_DATE)
                          ? 'Today'
                          : toFormattedDateString(endDate)}
                      </LabelText>
                    </AnimatedOptionLabel>
                  )}
                </>
              );
            }}
          />
          <Switch value={isEndDateEnabled ? 1 : 0} onToggle={() => {}} />
        </Row>
      </OptionContainer>
      <OptionContainer onPress={toggleRemindersModal}>
        <OptionInfo>
          <BellSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Time and reminders</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>
            {!!reminders.length
              ? reminders.length === 1
                ? `${reminders.length} reminder`
                : `${reminders.length} reminders`
              : '---'}
          </LabelText>
        </OptionLabel>
      </OptionContainer>
      <OptionContainer onPress={togglePriorityModal}>
        <OptionInfo>
          <FlagSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
          <OptionTitle>Priority</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>{currentPriority}</LabelText>
        </OptionLabel>
      </OptionContainer>

      <ModalContainer isOpen={isRemindersOpen} closeModal={toggleRemindersModal}>
        <RemindersModalModule
          control={control}
          reminders={reminders}
          closeModal={toggleRemindersModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isPriorityOpen} closeModal={togglePriorityModal}>
        <PriorityModalModule
          isForm
          control={control as any}
          currentPriority={currentPriority}
          closeModal={togglePriorityModal}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 60,
});

const HeadingContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  height: 94,
});

const Heading = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '$customRed1',
});

const OptionContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 60,
  paddingHorizontal: 8,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const OptionInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

const OptionTitle = styled(Text, {
  fontSize: 16,
});

const Row = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const OptionLabel = styled(View, {
  paddingHorizontal: 26,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: '$customRed5',
});

const LabelText = styled(Text, {
  fontSize: 14,
  fontWeight: 'bold',
  color: '$customRed1',
});

const AnimatedOptionLabel = Animated.createAnimatedComponent(OptionLabel);

export default DurationListModule;

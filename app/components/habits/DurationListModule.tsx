import { useRef, useState } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { Control, Controller } from 'react-hook-form';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, Text, styled } from 'tamagui';

import { Priority, Reminder } from '@/app/entities';
import { SCREEN_WIDTH, SCREEN_HEIGHT, TODAYS_DATE } from '@/app/constants';
import { toFormattedDateString } from '@/app/utils';
import { NewHabitData } from '@/app/newHabit';
import Switch from '../tabs/settings/Switch';
import ModalContainer from '../tabs/modals/ModalContainer';
import PriorityModalModule from '../tabs/modals/PriorityModalModule';
import RemindersModalModule from '../tabs/modals/RemindersModalModule';

interface Props {
  control: Control<NewHabitData>;
  currentPriority: Priority;
  startDate: Date;
  endDate?: Date;
  reminders: Reminder[];
}

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

  return (
    <Container>
      <HeadingContainer>
        <Heading>When do you want to do it?</Heading>
      </HeadingContainer>

      <OptionContainer onPress={() => showDatePicker('start')}>
        <OptionInfo>
          <Svg width="21" height="22" viewBox="0 0 21 22" fill="none">
            <Path
              d="M19.1102 1.55977H17.5504V3.93164C17.5504 4.37422 17.2109 4.70938 16.7727 4.70938H13.6188C13.1762 4.70938 12.841 4.36992 12.841 3.93164V1.55977H8.09297V3.93164C8.09297 4.37422 7.75352 4.70938 7.31524 4.70938H4.16133C3.71875 4.70938 3.38359 4.36992 3.38359 3.93164V1.55977H1.81953C0.938672 1.55977 0.259766 2.27305 0.259766 3.11953V20.4402C0.259766 21.3211 0.973047 22 1.81953 22H19.1402C20.0211 22 20.7 21.2867 20.7 20.4402V3.15391C20.7043 2.27305 19.991 1.55977 19.1102 1.55977ZM19.1102 20.4746H1.81953V6.30352H19.1402V20.4746H19.1102ZM6.5332 3.15391H4.97344V1.03301e-07H6.5332V3.15391ZM15.9906 3.15391H14.4309V1.03301e-07H15.9906V3.15391Z"
              fill="#C73A57"
            />
            <Rect x="3" y="8" width="5.60938" height="5.60938" fill="#C73A57" />
          </Svg>
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
          <Svg width="21" height="22" viewBox="0 0 21 22" fill="none">
            <Path
              d="M19.1102 1.55977H17.5504V3.93164C17.5504 4.37422 17.2109 4.70938 16.7727 4.70938H13.6188C13.1762 4.70938 12.841 4.36992 12.841 3.93164V1.55977H8.09297V3.93164C8.09297 4.37422 7.75352 4.70938 7.31524 4.70938H4.16133C3.71875 4.70938 3.38359 4.36992 3.38359 3.93164V1.55977H1.81953C0.938672 1.55977 0.259766 2.27305 0.259766 3.11953V20.4402C0.259766 21.3211 0.973047 22 1.81953 22H19.1402C20.0211 22 20.7 21.2867 20.7 20.4402V3.15391C20.7043 2.27305 19.991 1.55977 19.1102 1.55977ZM19.1102 20.4746H1.81953V6.30352H19.1402V20.4746H19.1102ZM6.5332 3.15391H4.97344V1.03301e-07H6.5332V3.15391ZM15.9906 3.15391H14.4309V1.03301e-07H15.9906V3.15391Z"
              fill="#C73A57"
            />
            <Rect x="12" y="13" width="5.60938" height="5.60938" fill="#C73A57" />
          </Svg>
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
          <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <Path
              d="M8.9375 0.6875C8.9375 0.309375 9.24688 0 9.625 0C10.0031 0 10.3125 0.309375 10.3125 0.6875V1.40937C13.7887 1.75312 16.5 4.68359 16.5 8.25V9.50039C16.5 11.3781 17.2477 13.1785 18.5754 14.5105L18.6957 14.6309C19.0523 14.9875 19.2543 15.473 19.2543 15.9758C19.2543 17.0285 18.4035 17.8793 17.3508 17.8793H1.90352C0.850781 17.875 0 17.0242 0 15.9715C0 15.4688 0.201953 14.9832 0.558594 14.6266L0.678906 14.5063C2.00234 13.1785 2.75 11.3781 2.75 9.50039V8.25C2.75 4.68359 5.46133 1.75312 8.9375 1.40937V0.6875ZM9.625 2.75C6.58711 2.75 4.125 5.21211 4.125 8.25V9.50039C4.125 11.7434 3.23555 13.8961 1.6457 15.4816L1.52969 15.5977C1.43086 15.6965 1.375 15.8297 1.375 15.9715C1.375 16.2637 1.61133 16.5 1.90352 16.5H17.3465C17.6387 16.5 17.875 16.2637 17.875 15.9715C17.875 15.8297 17.8191 15.6965 17.7203 15.5977L17.6 15.4773C16.0145 13.8918 15.1207 11.7391 15.1207 9.49609V8.25C15.1207 5.21211 12.6586 2.75 9.6207 2.75H9.625ZM8.32734 19.7098C8.51641 20.2426 9.02774 20.625 9.625 20.625C10.2223 20.625 10.7336 20.2426 10.9227 19.7098C11.0473 19.3531 11.4426 19.1641 11.7992 19.2887C12.1559 19.4133 12.3449 19.8086 12.2203 20.1652C11.8422 21.2352 10.8238 22 9.625 22C8.42617 22 7.40781 21.2352 7.02969 20.1652C6.90508 19.8086 7.08984 19.4133 7.45078 19.2887C7.81172 19.1641 8.20274 19.3488 8.32734 19.7098Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Time and reminders</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>
            {!reminders.length && '---'}
            {reminders.length > 0
              ? reminders.length === 1
                ? `${reminders.length} reminder`
                : `${reminders.length} reminders`
              : ''}
          </LabelText>
        </OptionLabel>
      </OptionContainer>
      <OptionContainer onPress={togglePriorityModal}>
        <OptionInfo>
          <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <Path
              d="M2.0625 1.03125C2.0625 0.459766 1.60273 0 1.03125 0C0.459766 0 0 0.459766 0 1.03125V2.75V15.0605V17.1875V20.9688C0 21.5402 0.459766 22 1.03125 22C1.60273 22 2.0625 21.5402 2.0625 20.9688V16.6719L5.51289 15.8082C7.27891 15.3656 9.14805 15.5719 10.7766 16.384C12.6758 17.3336 14.8801 17.4496 16.8652 16.702L18.3563 16.1434C18.8934 15.9414 19.25 15.4301 19.25 14.8543V2.84023C19.25 1.85195 18.2102 1.20742 17.325 1.65L16.9125 1.85625C14.923 2.85313 12.5812 2.85313 10.5918 1.85625C9.08359 1.1 7.35195 0.910938 5.71484 1.31914L2.0625 2.23438V1.03125ZM2.0625 4.36133L6.21328 3.32148C7.37344 3.03359 8.59805 3.1668 9.66797 3.69961C12.027 4.87695 14.7684 4.97578 17.1875 3.9918V14.3816L16.1391 14.7727C14.691 15.3141 13.0797 15.2324 11.6961 14.5406C9.625 13.5051 7.25742 13.2473 5.01016 13.8059L2.0625 14.5449V4.36133Z"
              fill="#C73A57"
            />
          </Svg>
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
  color: '#C73A57',
});

const OptionContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 60,
  paddingHorizontal: 8,
  borderBottomWidth: 1,
  borderColor: '#262626',
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
  backgroundColor: '#31181E',
});

const LabelText = styled(Text, {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#C73A57',
});

const AnimatedOptionLabel = Animated.createAnimatedComponent(OptionLabel);

export default DurationListModule;

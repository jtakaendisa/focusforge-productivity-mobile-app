import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { Habit } from '@/app/entities';
import { useHabitStore } from '@/app/store';
import { TODAYS_DATE } from '@/app/constants';
import { toFormattedDateString, toTruncatedText } from '@/app/utils';
import { habitSchema } from '@/app/validationSchemas';
import { NewHabitData } from '@/app/newHabit';
import CategoryIcon from '../CategoryIcon';
import ModalContainer from '../modals/ModalContainer';
import CategoryModalModule from '../modals/CategoryModalModule';
import TextModalModule from '../modals/TextModalModule';
import RemindersModalModule from '../modals/RemindersModalModule';
import PriorityModalModule from '../modals/PriorityModalModule';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FrequencyListModule from './FrequencyListModule';
import FrequencyBadge from './FrequencyBadge';

interface Props {
  habits: Habit[];
  selectedHabit: Habit;
}

const SVG_SIZE = 22;

const EditHabit = ({ habits, selectedHabit }: Props) => {
  const setHabits = useHabitStore((s) => s.setHabits);

  const [modalState, setModalState] = useState({
    isTitleOpen: false,
    isCategoryOpen: false,
    isNoteOpen: false,
    isRemindersOpen: false,
    isPriorityOpen: false,
    isFrequencyOpen: false,
  });

  const setStartDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewHabitData>({
    defaultValues: {
      ...selectedHabit,
    },
    resolver: zodResolver(habitSchema),
  });

  const watchAllFields = watch();

  const {
    isTitleOpen,
    isCategoryOpen,
    isRemindersOpen,
    isPriorityOpen,
    isNoteOpen,
    isFrequencyOpen,
  } = modalState;

  const { title, category, note, priority, frequency, startDate, endDate, reminders } =
    watchAllFields;

  const handleDelete = () => {
    const filteredHabits = habits.filter((habit) => habit.id !== selectedHabit.id);
    setHabits(filteredHabits);
    router.replace('/habits');
  };

  const handleEndDateClear = () => setEndDateRef.current?.();

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    mode: 'start' | 'end'
  ) => {
    if (selectedDate) {
      if (mode === 'start') {
        setStartDateRef.current?.(selectedDate);
      } else {
        if (
          toFormattedDateString(selectedDate) !== toFormattedDateString(TODAYS_DATE)
        ) {
          setEndDateRef.current?.(selectedDate);
        } else {
          setEndDateRef.current?.();
        }
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

  const onSubmit: SubmitHandler<NewHabitData> = (data) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === selectedHabit.id
        ? {
            ...selectedHabit,
            ...data,
          }
        : habit
    );
    setHabits(updatedHabits);
  };

  const toggleTitleModal = () =>
    setModalState({ ...modalState, isTitleOpen: !isTitleOpen });

  const toggleCategoryModal = () =>
    setModalState({ ...modalState, isCategoryOpen: !isCategoryOpen });

  const toggleNoteModal = () =>
    setModalState({ ...modalState, isNoteOpen: !isNoteOpen });

  const toggleRemindersModal = () =>
    setModalState({ ...modalState, isRemindersOpen: !isRemindersOpen });

  const togglePriorityModal = () =>
    setModalState({ ...modalState, isPriorityOpen: !isPriorityOpen });

  const toggleFrequencyModal = () =>
    setModalState({ ...modalState, isFrequencyOpen: !isFrequencyOpen });

  useEffect(() => {
    if (!isSubmitSuccessful) return;

    reset();
    router.replace('/habits');
  }, [isSubmitSuccessful]);

  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <OptionContainer onPress={toggleTitleModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
            <Path
              d="M16.8358 2.09756C17.2493 1.64101 17.835 1.37827 18.4509 1.37827C19.6483 1.37827 20.6217 2.35168 20.6217 3.54906C20.6217 4.16497 20.359 4.75074 19.9024 5.16422L10.9996 13.1798L8.82025 11.0004L16.8358 2.09756ZM18.4509 0C17.4431 0 16.4869 0.426404 15.8107 1.17584L7.48935 10.4232L4.20733 11.4311C3.35453 11.6938 2.68262 12.3485 2.40266 13.1927L0.0725099 20.1831C-0.28498 21.2599 0.740112 22.285 1.81689 21.9275L8.80302 19.5973C9.64721 19.3174 10.3062 18.6455 10.5646 17.7927L11.5768 14.5106L20.8242 6.18931C21.5736 5.51741 22 4.55692 22 3.54906C22 1.58932 20.4107 0 18.4509 0ZM10.1942 14.3211L9.25096 17.3878C9.12174 17.8142 8.7901 18.1502 8.368 18.288L2.84198 20.1314L5.74928 17.2284C5.76651 17.2284 5.78804 17.2284 5.80527 17.2284C6.37812 17.2284 6.83898 16.7676 6.83898 16.1947C6.83898 15.6219 6.37812 15.161 5.80527 15.161C5.23243 15.161 4.77157 15.6219 4.77157 16.1947C4.77157 16.212 4.77157 16.2335 4.77157 16.2507L1.86857 19.158L3.71202 13.632C3.85415 13.2099 4.19011 12.8826 4.6122 12.749L7.67886 11.8058L10.1942 14.3211Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Title</OptionTitle>
        </OptionInfo>
        <Text color={customGray1}>{toTruncatedText(title, 24)}</Text>
      </OptionContainer>
      <OptionContainer onPress={toggleCategoryModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
            <Path
              d="M16.9652 10.7911C18.6356 10.7963 19.9898 12.1745 20 13.8797V16.9019C19.9899 18.6086 18.6371 19.9897 16.9652 20H14.0046C12.3343 19.9896 10.9842 18.6071 10.9791 16.9019V13.8797C10.9791 12.1739 12.3337 10.7911 14.0046 10.7911H16.9652ZM4.25058 10.7911C4.56143 10.7571 4.86401 10.9073 5.02984 11.1778C5.19568 11.4484 5.19568 11.7918 5.02984 12.0624C4.86401 12.3329 4.56143 12.4831 4.25058 12.4491H3.0348C2.25932 12.4491 1.62923 13.0881 1.62413 13.8797V16.8641C1.64385 17.6493 2.26544 18.2797 3.0348 18.2947H6.01392C6.3872 18.2972 6.74604 18.1476 7.01086 17.879C7.27568 17.6104 7.4246 17.2451 7.42459 16.8641V12.3828L7.41193 12.2713C7.39793 11.9748 7.54013 11.6893 7.79039 11.5273C8.07192 11.345 8.4337 11.3558 8.70439 11.5544C8.97508 11.753 9.10035 12.0996 9.02088 12.4301V16.8925C9.02088 18.6035 7.66215 19.9905 5.98608 19.9905H3.0348C1.37322 19.9553 0.0344736 18.5887 0 16.8925V13.8797C0 13.0589 0.320029 12.2719 0.889434 11.6924C1.45884 11.1129 2.23078 10.7886 3.0348 10.7911H4.25058ZM16.9652 12.4491H14.0046C13.2307 12.4491 12.6032 13.0896 12.6032 13.8797V16.9019C12.6008 17.2821 12.7476 17.6475 13.011 17.9163C13.2743 18.1852 13.6322 18.3351 14.0046 18.3326H16.9652C17.3376 18.3351 17.6955 18.1852 17.9589 17.9163C18.2222 17.6475 18.3691 17.2821 18.3666 16.9019V13.8797C18.3666 13.5003 18.2189 13.1364 17.9561 12.8681C17.6933 12.5998 17.3369 12.4491 16.9652 12.4491ZM16.9652 0C18.6232 0.0401889 19.9564 1.40542 19.9907 3.09806V6.11085C20.0006 6.93001 19.6913 7.71963 19.1309 8.30597C18.5704 8.89231 17.8048 9.22734 17.0023 9.23733H15.7773C15.3622 9.19197 15.0475 8.83444 15.0475 8.40834C15.0475 7.98224 15.3622 7.6247 15.7773 7.57935H16.9652C17.341 7.57686 17.7002 7.42142 17.9633 7.14752C18.2264 6.87362 18.3715 6.50389 18.3666 6.12032V3.09806C18.3566 2.31222 17.735 1.67766 16.9652 1.66746H14.0046C13.2307 1.66746 12.6032 2.30796 12.6032 3.09806V7.61724L12.5936 7.72116C12.5306 8.129 12.1826 8.43702 11.768 8.43202C11.5522 8.42709 11.3473 8.33414 11.199 8.17393C11.0508 8.01371 10.9716 7.79958 10.9791 7.57935V3.09806C10.9767 2.27727 11.2943 1.48924 11.862 0.907972C12.4296 0.3267 13.2006 0 14.0046 0H16.9652ZM5.99536 0C7.66932 0.00520202 9.02507 1.38921 9.03016 3.09806V6.12032C9.03016 6.94111 8.71013 7.72814 8.14073 8.30764C7.57132 8.88713 6.79939 9.21142 5.99536 9.20892H3.0348C1.36445 9.20374 0.0101775 7.82547 5.10441e-08 6.12032V3.09806C0.0101328 1.39135 1.36294 0.010344 3.0348 0H5.99536ZM5.99536 1.66746H3.0348C2.65833 1.65982 2.29469 1.80716 2.02582 2.07629C1.75696 2.34541 1.60549 2.71366 1.60557 3.09806V6.12032C1.59791 6.50962 1.74603 6.88529 2.01574 7.16062C2.28546 7.43595 2.65345 7.58716 3.0348 7.57935H5.99536C6.37112 7.57686 6.73038 7.42142 6.99346 7.14752C7.25654 6.87362 7.4017 6.50389 7.39675 6.12032V3.09806C7.39169 2.31011 6.76722 1.67262 5.99536 1.66746Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Category</OptionTitle>
        </OptionInfo>
        <CategoryContainer>
          <CategoryIcon category={category} />
        </CategoryContainer>
      </OptionContainer>
      <OptionContainer onPress={toggleNoteModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
            <Path
              d="M17.8924 1.63141L18.3686 2.10765C18.8606 2.59963 18.8606 3.3986 18.3686 3.89058L17.3177 4.94145L15.0585 2.68228L16.1094 1.63141C16.6014 1.13943 17.4004 1.13943 17.8924 1.63141ZM7.43875 10.3021L14.169 3.57178L16.4282 5.83096L9.69792 12.5613C9.53262 12.7266 9.32008 12.8446 9.0918 12.8997L6.50989 13.494L7.1042 10.9082C7.15537 10.6799 7.27344 10.4674 7.44269 10.3021H7.43875ZM15.2199 0.737971L6.54925 9.41258C6.2147 9.74712 5.98249 10.1683 5.87622 10.6288L5.05363 14.1946C5.0064 14.4072 5.06937 14.6276 5.22287 14.7811C5.37637 14.9346 5.59677 14.9975 5.80931 14.9503L9.37519 14.1277C9.83568 14.0215 10.2568 13.7892 10.5914 13.4547L19.262 4.78009C20.246 3.79612 20.246 2.20211 19.262 1.21814L18.7858 0.737971C17.8018 -0.24599 16.2078 -0.24599 15.2239 0.737971H15.2199ZM3.14868 2.36741C1.40903 2.36741 0 3.77644 0 5.51609V16.8513C0 18.591 1.40903 20 3.14868 20H14.4839C16.2236 20 17.6326 18.591 17.6326 16.8513V11.8134C17.6326 11.4671 17.3492 11.1837 17.0029 11.1837C16.6565 11.1837 16.3731 11.4671 16.3731 11.8134V16.8513C16.3731 17.8943 15.5269 18.7405 14.4839 18.7405H3.14868C2.10568 18.7405 1.25947 17.8943 1.25947 16.8513V5.51609C1.25947 4.47309 2.10568 3.62688 3.14868 3.62688H8.18656C8.53291 3.62688 8.81629 3.3435 8.81629 2.99715C8.81629 2.65079 8.53291 2.36741 8.18656 2.36741H3.14868Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Notes</OptionTitle>
        </OptionInfo>
        <Text color={customGray1}>{toTruncatedText(note, 16)}</Text>
      </OptionContainer>
      <OptionContainer onPress={toggleRemindersModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 22" fill="none">
            <Path
              d="M8.9375 0.6875C8.9375 0.309375 9.24688 0 9.625 0C10.0031 0 10.3125 0.309375 10.3125 0.6875V1.40937C13.7887 1.75312 16.5 4.68359 16.5 8.25V9.50039C16.5 11.3781 17.2477 13.1785 18.5754 14.5105L18.6957 14.6309C19.0523 14.9875 19.2543 15.473 19.2543 15.9758C19.2543 17.0285 18.4035 17.8793 17.3508 17.8793H1.90352C0.850781 17.875 0 17.0242 0 15.9715C0 15.4688 0.201953 14.9832 0.558594 14.6266L0.678906 14.5063C2.00234 13.1785 2.75 11.3781 2.75 9.50039V8.25C2.75 4.68359 5.46133 1.75312 8.9375 1.40937V0.6875ZM9.625 2.75C6.58711 2.75 4.125 5.21211 4.125 8.25V9.50039C4.125 11.7434 3.23555 13.8961 1.6457 15.4816L1.52969 15.5977C1.43086 15.6965 1.375 15.8297 1.375 15.9715C1.375 16.2637 1.61133 16.5 1.90352 16.5H17.3465C17.6387 16.5 17.875 16.2637 17.875 15.9715C17.875 15.8297 17.8191 15.6965 17.7203 15.5977L17.6 15.4773C16.0145 13.8918 15.1207 11.7391 15.1207 9.49609V8.25C15.1207 5.21211 12.6586 2.75 9.6207 2.75H9.625ZM8.32734 19.7098C8.51641 20.2426 9.02774 20.625 9.625 20.625C10.2223 20.625 10.7336 20.2426 10.9227 19.7098C11.0473 19.3531 11.4426 19.1641 11.7992 19.2887C12.1559 19.4133 12.3449 19.8086 12.2203 20.1652C11.8422 21.2352 10.8238 22 9.625 22C8.42617 22 7.40781 21.2352 7.02969 20.1652C6.90508 19.8086 7.08984 19.4133 7.45078 19.2887C7.81172 19.1641 8.20274 19.3488 8.32734 19.7098Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Time and reminders</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>
            {!!reminders.length
              ? reminders.length + (reminders.length === 1 ? ' reminder' : ' reminders')
              : '---'}
          </LabelText>
        </OptionLabel>
      </OptionContainer>
      <OptionContainer onPress={togglePriorityModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 18 20" fill="none">
            <Path
              d="M1.875 0.9375C1.875 0.417969 1.45703 0 0.9375 0C0.417969 0 0 0.417969 0 0.9375V2.5V13.6914V15.625V19.0625C0 19.582 0.417969 20 0.9375 20C1.45703 20 1.875 19.582 1.875 19.0625V15.1562L5.01172 14.3711C6.61719 13.9688 8.31641 14.1562 9.79688 14.8945C11.5234 15.7578 13.5273 15.8633 15.332 15.1836L16.6875 14.6758C17.1758 14.4922 17.5 14.0273 17.5 13.5039V2.58203C17.5 1.68359 16.5547 1.09766 15.75 1.5L15.375 1.6875C13.5664 2.59375 11.4375 2.59375 9.62891 1.6875C8.25781 1 6.68359 0.828125 5.19531 1.19922L1.875 2.03125V0.9375ZM1.875 3.96484L5.64844 3.01953C6.70312 2.75781 7.81641 2.87891 8.78906 3.36328C10.9336 4.43359 13.4258 4.52344 15.625 3.62891V13.0742L14.6719 13.4297C13.3555 13.9219 11.8906 13.8477 10.6328 13.2188C8.75 12.2773 6.59766 12.043 4.55469 12.5508L1.875 13.2227V3.96484Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Priority</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>{priority}</LabelText>
        </OptionLabel>
      </OptionContainer>
      <OptionContainer onPress={toggleFrequencyModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
            <Path
              d="M0 9.625V4.125V2.75H1.375H13.75V0H15.125L19.25 4.125L15.125 8.25H13.75V5.5H2.75V9.625V11H0V9.625ZM22 12.375V17.875V19.25H20.625H8.25V22H6.875L2.75 17.875L6.875 13.75H8.25V16.5H19.25V12.375V11H22V12.375Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Frequency</OptionTitle>
        </OptionInfo>
        <FrequencyBadge frequency={frequency} isForm />
      </OptionContainer>
      <OptionContainer onPress={() => showDatePicker('start')}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 21 22" fill="none">
            <Path
              d="M19.1102 1.55977H17.5504V3.93164C17.5504 4.37422 17.2109 4.70938 16.7727 4.70938H13.6188C13.1762 4.70938 12.841 4.36992 12.841 3.93164V1.55977H8.09297V3.93164C8.09297 4.37422 7.75352 4.70938 7.31524 4.70938H4.16133C3.71875 4.70938 3.38359 4.36992 3.38359 3.93164V1.55977H1.81953C0.938672 1.55977 0.259766 2.27305 0.259766 3.11953V20.4402C0.259766 21.3211 0.973047 22 1.81953 22H19.1402C20.0211 22 20.7 21.2867 20.7 20.4402V3.15391C20.7043 2.27305 19.991 1.55977 19.1102 1.55977ZM19.1102 20.4746H1.81953V6.30352H19.1402V20.4746H19.1102ZM6.5332 3.15391H4.97344V1.03301e-07H6.5332V3.15391ZM15.9906 3.15391H14.4309V1.03301e-07H15.9906V3.15391Z"
              fill={customRed1}
            />
            <Rect x="3" y="8" width="5.60938" height="5.60938" fill={customRed1} />
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
      <OptionContainer onPress={() => showDatePicker('end')}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 21 22" fill="none">
            <Path
              d="M19.1102 1.55977H17.5504V3.93164C17.5504 4.37422 17.2109 4.70938 16.7727 4.70938H13.6188C13.1762 4.70938 12.841 4.36992 12.841 3.93164V1.55977H8.09297V3.93164C8.09297 4.37422 7.75352 4.70938 7.31524 4.70938H4.16133C3.71875 4.70938 3.38359 4.36992 3.38359 3.93164V1.55977H1.81953C0.938672 1.55977 0.259766 2.27305 0.259766 3.11953V20.4402C0.259766 21.3211 0.973047 22 1.81953 22H19.1402C20.0211 22 20.7 21.2867 20.7 20.4402V3.15391C20.7043 2.27305 19.991 1.55977 19.1102 1.55977ZM19.1102 20.4746H1.81953V6.30352H19.1402V20.4746H19.1102ZM6.5332 3.15391H4.97344V1.03301e-07H6.5332V3.15391ZM15.9906 3.15391H14.4309V1.03301e-07H15.9906V3.15391Z"
              fill={customRed1}
            />
            <Rect x="12" y="13" width="5.60938" height="5.60938" fill={customRed1} />
          </Svg>
          <OptionTitle>End date</OptionTitle>
        </OptionInfo>
        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange } }) => {
            setEndDateRef.current = onChange;
            return (
              <LabelRow>
                {endDate && (
                  <AnimatedIconContainer
                    onPress={handleEndDateClear}
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    <Svg
                      width={SVG_SIZE / 1.2}
                      height={SVG_SIZE / 1.2}
                      viewBox="0 0 21 24"
                      fill="none"
                    >
                      <Path
                        d="M7.67813 0H13.3219C13.8891 0 14.4094 0.31875 14.6625 0.829688L15 1.5H19.5C20.3297 1.5 21 2.17031 21 3C21 3.82969 20.3297 4.5 19.5 4.5H1.5C0.670312 4.5 0 3.82969 0 3C0 2.17031 0.670312 1.5 1.5 1.5H6L6.3375 0.829688C6.59062 0.31875 7.11094 0 7.67813 0ZM1.5 6H19.5L18.5062 21.8906C18.4312 23.0766 17.4469 24 16.2609 24H4.73906C3.55312 24 2.56875 23.0766 2.49375 21.8906L1.5 6ZM6.70312 11.2031C6.2625 11.6437 6.2625 12.3562 6.70312 12.7922L8.90625 14.9953L6.70312 17.1984C6.2625 17.6391 6.2625 18.3516 6.70312 18.7875C7.14375 19.2234 7.85625 19.2281 8.29219 18.7875L10.4953 16.5844L12.6984 18.7875C13.1391 19.2281 13.8516 19.2281 14.2875 18.7875C14.7234 18.3469 14.7281 17.6344 14.2875 17.1984L12.0844 14.9953L14.2875 12.7922C14.7281 12.3516 14.7281 11.6391 14.2875 11.2031C13.8469 10.7672 13.1344 10.7625 12.6984 11.2031L10.4953 13.4062L8.29219 11.2031C7.85156 10.7625 7.13906 10.7625 6.70312 11.2031Z"
                        fill={customGray1}
                      />
                    </Svg>
                  </AnimatedIconContainer>
                )}
                <OptionLabel>
                  <LabelText>
                    {endDate
                      ? toFormattedDateString(endDate) ===
                        toFormattedDateString(TODAYS_DATE)
                        ? 'Today'
                        : toFormattedDateString(endDate)
                      : '---'}
                  </LabelText>
                </OptionLabel>
              </LabelRow>
            );
          }}
        />
      </OptionContainer>
      <OptionContainer onPress={handleDelete}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 22" fill="none">
            <Path
              d="M7.32617 2.21719L6.50977 3.4375H12.7402L11.9238 2.21719C11.8594 2.12266 11.752 2.0625 11.6359 2.0625H7.60977C7.49375 2.0625 7.38633 2.11836 7.32187 2.21719H7.32617ZM13.6426 1.07422L15.2195 3.4375H15.8082H17.875H18.2188C18.7902 3.4375 19.25 3.89727 19.25 4.46875C19.25 5.04023 18.7902 5.5 18.2188 5.5H17.7203L16.6891 19.452C16.5816 20.8871 15.3871 22 13.9477 22H5.30234C3.86289 22 2.66836 20.8871 2.56094 19.452L1.52969 5.5H1.03125C0.459766 5.5 0 5.04023 0 4.46875C0 3.89727 0.459766 3.4375 1.03125 3.4375H1.375H3.4418H4.03047L5.60742 1.06992C6.0543 0.403906 6.80625 0 7.60977 0H11.6359C12.4395 0 13.1914 0.403906 13.6383 1.06992L13.6426 1.07422ZM3.59648 5.5L4.61914 19.3016C4.64492 19.6625 4.9457 19.9375 5.30664 19.9375H13.9477C14.3086 19.9375 14.6051 19.6582 14.6352 19.3016L15.6535 5.5H3.59648ZM6.26914 9.01914C6.6043 8.68398 7.15 8.68398 7.48516 9.01914L9.625 11.159L11.7691 9.01484C12.1043 8.67969 12.65 8.67969 12.9852 9.01484C13.3203 9.35 13.3203 9.8957 12.9852 10.2309L10.841 12.375L12.9852 14.5191C13.3203 14.8543 13.3203 15.4 12.9852 15.7352C12.65 16.0703 12.1043 16.0703 11.7691 15.7352L9.625 13.591L7.48086 15.7352C7.1457 16.0703 6.6 16.0703 6.26484 15.7352C5.92969 15.4 5.92969 14.8543 6.26484 14.5191L8.40898 12.375L6.26484 10.2309C5.92969 9.8957 5.92969 9.35 6.26484 9.01484L6.26914 9.01914Z"
              fill={customRed1}
            />
          </Svg>
          <OptionTitle>Delete</OptionTitle>
        </OptionInfo>
      </OptionContainer>

      <ButtonsContainer>
        <Button onPress={() => router.replace('/habits')}>
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText color={customRed1}>CONFIRM</ButtonText>
        </Button>
      </ButtonsContainer>

      <ModalContainer isOpen={isTitleOpen} closeModal={toggleTitleModal}>
        <TextModalModule
          control={control as any}
          name="title"
          previousText={title}
          closeModal={toggleTitleModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isCategoryOpen} closeModal={toggleCategoryModal}>
        <CategoryModalModule
          control={control as any}
          closeModal={toggleCategoryModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isNoteOpen} closeModal={toggleNoteModal}>
        <TextModalModule
          control={control as any}
          name="note"
          previousText={note}
          closeModal={toggleNoteModal}
        />
      </ModalContainer>
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
          currentPriority={priority}
          closeModal={togglePriorityModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isFrequencyOpen} closeModal={toggleFrequencyModal}>
        <FrequencyListModule
          isModal
          control={control as any}
          closeModal={toggleFrequencyModal}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
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

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: '$customRed1',
  borderRadius: 8,
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

const LabelRow = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '$customGray3',
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const Button = styled(View, {
  width: '50%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ButtonText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

const AnimatedIconContainer = Animated.createAnimatedComponent(IconContainer);

export default EditHabit;

import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Svg, { Path } from 'react-native-svg';

import { Task } from '@/app/entities';
import { NewTaskData } from '@/app/newTask';
import { useTaskStore } from '@/app/store';
import { toFormattedDateString, toTruncatedText } from '@/app/utils';
import { taskSchema } from '@/app/validationSchemas';
import { View, Text, styled } from 'tamagui';
import CategoryIcon from '../CategoryIcon';
import { TODAYS_DATE } from '@/app/constants';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import FrequencyBadge from '../habits/FrequencyBadge';
import CircularCheckbox from '../CircularCheckbox';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import FrequencyListModule from '../habits/FrequencyListModule';
import CategoryModalModule from '../modals/CategoryModalModule';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import RemindersModalModule from '../modals/RemindersModalModule';
import TextModalModule from '../modals/TextModalModule';

interface Props {
  tasks: Task[];
  selectedTask: Task;
}

const SVG_SIZE = 22;
const EditTask = ({ tasks, selectedTask }: Props) => {
  const { isRecurring } = selectedTask;

  const setTasks = useTaskStore((s) => s.setTasks);

  const [modalState, setModalState] = useState({
    isTitleOpen: false,
    isCategoryOpen: false,
    isRemindersOpen: false,
    isChecklistOpen: false,
    isPriorityOpen: false,
    isFrequencyOpen: false,
    isNoteOpen: false,
  });

  const setDueDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setIsCarriedOverRef = useRef<((...event: any[]) => void) | null>(null);

  const {
    isTitleOpen,
    isCategoryOpen,
    isRemindersOpen,
    isChecklistOpen,
    isPriorityOpen,
    isFrequencyOpen,
    isNoteOpen,
  } = modalState;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewTaskData>({
    defaultValues: {
      ...selectedTask,
    },
    resolver: zodResolver(taskSchema),
  });

  const watchAllFields = watch();

  const {
    title,
    category,
    dueDate,
    checklist,
    priority,
    note,
    isCarriedOver,
    frequency,
    reminders,
  } = watchAllFields;

  const isChecked = useSharedValue(isCarriedOver ? 1 : 0);

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDueDateRef.current?.(selectedDate);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: handleDateSelect,
      is24Hour: true,
      minimumDate: TODAYS_DATE,
    });
  };

  const onSubmit: SubmitHandler<NewTaskData> = (data) => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...selectedTask,
            ...data,
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const toggleTitleModal = () =>
    setModalState({ ...modalState, isTitleOpen: !isTitleOpen });

  const toggleCategoryModal = () =>
    setModalState({ ...modalState, isCategoryOpen: !isCategoryOpen });

  const toggleRemindersModal = () =>
    setModalState({ ...modalState, isRemindersOpen: !isRemindersOpen });

  const toggleChecklistModal = () =>
    setModalState({ ...modalState, isChecklistOpen: !isChecklistOpen });

  const togglePriorityModal = () =>
    setModalState({ ...modalState, isPriorityOpen: !isPriorityOpen });

  const toggleFrequencyModal = () =>
    setModalState({ ...modalState, isFrequencyOpen: !isFrequencyOpen });

  const toggleNoteModal = () =>
    setModalState({ ...modalState, isNoteOpen: !isNoteOpen });

  useEffect(() => {
    isChecked.value = isCarriedOver ? withTiming(1) : withTiming(0);
  }, [isCarriedOver]);

  useEffect(() => {
    if (!isSubmitSuccessful) return;

    reset();
    router.replace('/tasks');
  }, [isSubmitSuccessful]);

  return (
    <Container>
      <OptionContainer onPress={toggleTitleModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
            <Path
              d="M16.8358 2.09756C17.2493 1.64101 17.835 1.37827 18.4509 1.37827C19.6483 1.37827 20.6217 2.35168 20.6217 3.54906C20.6217 4.16497 20.359 4.75074 19.9024 5.16422L10.9996 13.1798L8.82025 11.0004L16.8358 2.09756ZM18.4509 0C17.4431 0 16.4869 0.426404 15.8107 1.17584L7.48935 10.4232L4.20733 11.4311C3.35453 11.6938 2.68262 12.3485 2.40266 13.1927L0.0725099 20.1831C-0.28498 21.2599 0.740112 22.285 1.81689 21.9275L8.80302 19.5973C9.64721 19.3174 10.3062 18.6455 10.5646 17.7927L11.5768 14.5106L20.8242 6.18931C21.5736 5.51741 22 4.55692 22 3.54906C22 1.58932 20.4107 0 18.4509 0ZM10.1942 14.3211L9.25096 17.3878C9.12174 17.8142 8.7901 18.1502 8.368 18.288L2.84198 20.1314L5.74928 17.2284C5.76651 17.2284 5.78804 17.2284 5.80527 17.2284C6.37812 17.2284 6.83898 16.7676 6.83898 16.1947C6.83898 15.6219 6.37812 15.161 5.80527 15.161C5.23243 15.161 4.77157 15.6219 4.77157 16.1947C4.77157 16.212 4.77157 16.2335 4.77157 16.2507L1.86857 19.158L3.71202 13.632C3.85415 13.2099 4.19011 12.8826 4.6122 12.749L7.67886 11.8058L10.1942 14.3211Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Title</OptionTitle>
        </OptionInfo>
        <Text color="#8C8C8C">{toTruncatedText(title, 24)}</Text>
      </OptionContainer>
      <OptionContainer onPress={toggleCategoryModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
            <Path
              d="M16.9652 10.7911C18.6356 10.7963 19.9898 12.1745 20 13.8797V16.9019C19.9899 18.6086 18.6371 19.9897 16.9652 20H14.0046C12.3343 19.9896 10.9842 18.6071 10.9791 16.9019V13.8797C10.9791 12.1739 12.3337 10.7911 14.0046 10.7911H16.9652ZM4.25058 10.7911C4.56143 10.7571 4.86401 10.9073 5.02984 11.1778C5.19568 11.4484 5.19568 11.7918 5.02984 12.0624C4.86401 12.3329 4.56143 12.4831 4.25058 12.4491H3.0348C2.25932 12.4491 1.62923 13.0881 1.62413 13.8797V16.8641C1.64385 17.6493 2.26544 18.2797 3.0348 18.2947H6.01392C6.3872 18.2972 6.74604 18.1476 7.01086 17.879C7.27568 17.6104 7.4246 17.2451 7.42459 16.8641V12.3828L7.41193 12.2713C7.39793 11.9748 7.54013 11.6893 7.79039 11.5273C8.07192 11.345 8.4337 11.3558 8.70439 11.5544C8.97508 11.753 9.10035 12.0996 9.02088 12.4301V16.8925C9.02088 18.6035 7.66215 19.9905 5.98608 19.9905H3.0348C1.37322 19.9553 0.0344736 18.5887 0 16.8925V13.8797C0 13.0589 0.320029 12.2719 0.889434 11.6924C1.45884 11.1129 2.23078 10.7886 3.0348 10.7911H4.25058ZM16.9652 12.4491H14.0046C13.2307 12.4491 12.6032 13.0896 12.6032 13.8797V16.9019C12.6008 17.2821 12.7476 17.6475 13.011 17.9163C13.2743 18.1852 13.6322 18.3351 14.0046 18.3326H16.9652C17.3376 18.3351 17.6955 18.1852 17.9589 17.9163C18.2222 17.6475 18.3691 17.2821 18.3666 16.9019V13.8797C18.3666 13.5003 18.2189 13.1364 17.9561 12.8681C17.6933 12.5998 17.3369 12.4491 16.9652 12.4491ZM16.9652 0C18.6232 0.0401889 19.9564 1.40542 19.9907 3.09806V6.11085C20.0006 6.93001 19.6913 7.71963 19.1309 8.30597C18.5704 8.89231 17.8048 9.22734 17.0023 9.23733H15.7773C15.3622 9.19197 15.0475 8.83444 15.0475 8.40834C15.0475 7.98224 15.3622 7.6247 15.7773 7.57935H16.9652C17.341 7.57686 17.7002 7.42142 17.9633 7.14752C18.2264 6.87362 18.3715 6.50389 18.3666 6.12032V3.09806C18.3566 2.31222 17.735 1.67766 16.9652 1.66746H14.0046C13.2307 1.66746 12.6032 2.30796 12.6032 3.09806V7.61724L12.5936 7.72116C12.5306 8.129 12.1826 8.43702 11.768 8.43202C11.5522 8.42709 11.3473 8.33414 11.199 8.17393C11.0508 8.01371 10.9716 7.79958 10.9791 7.57935V3.09806C10.9767 2.27727 11.2943 1.48924 11.862 0.907972C12.4296 0.3267 13.2006 0 14.0046 0H16.9652ZM5.99536 0C7.66932 0.00520202 9.02507 1.38921 9.03016 3.09806V6.12032C9.03016 6.94111 8.71013 7.72814 8.14073 8.30764C7.57132 8.88713 6.79939 9.21142 5.99536 9.20892H3.0348C1.36445 9.20374 0.0101775 7.82547 5.10441e-08 6.12032V3.09806C0.0101328 1.39135 1.36294 0.010344 3.0348 0H5.99536ZM5.99536 1.66746H3.0348C2.65833 1.65982 2.29469 1.80716 2.02582 2.07629C1.75696 2.34541 1.60549 2.71366 1.60557 3.09806V6.12032C1.59791 6.50962 1.74603 6.88529 2.01574 7.16062C2.28546 7.43595 2.65345 7.58716 3.0348 7.57935H5.99536C6.37112 7.57686 6.73038 7.42142 6.99346 7.14752C7.25654 6.87362 7.4017 6.50389 7.39675 6.12032V3.09806C7.39169 2.31011 6.76722 1.67262 5.99536 1.66746Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Category</OptionTitle>
        </OptionInfo>
        <Row>
          <Text color="#C73A57">{category}</Text>
          <CategoryContainer>
            <CategoryIcon category={category} />
          </CategoryContainer>
        </Row>
      </OptionContainer>
      <OptionContainer onPress={showDatePicker}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 19 20" fill="none">
            <Path
              d="M17.1367 1.41797H15.7188V3.57422C15.7188 3.97656 15.4102 4.28125 15.0117 4.28125H12.1445C11.7422 4.28125 11.4375 3.97266 11.4375 3.57422V1.41797H7.12109V3.57422C7.12109 3.97656 6.8125 4.28125 6.41406 4.28125H3.54688C3.14453 4.28125 2.83984 3.97266 2.83984 3.57422V1.41797H1.41797C0.617188 1.41797 0 2.06641 0 2.83594V18.582C0 19.3828 0.648438 20 1.41797 20H17.1641C17.9648 20 18.582 19.3516 18.582 18.582V2.86719C18.5859 2.06641 17.9375 1.41797 17.1367 1.41797ZM17.1367 18.6133H1.41797V5.73047H17.1641V18.6133H17.1367ZM5.70312 2.86719H4.28516V0H5.70312V2.86719ZM14.3008 2.86719H12.8828V0H14.3008V2.86719ZM7.12109 8.59766H5.70312V7.17969H7.12109V8.59766ZM9.98828 8.59766H8.57031V7.17969H9.98828V8.59766ZM12.8516 8.59766H11.4336V7.17969H12.8516V8.59766ZM15.7188 8.59766H14.3008V7.17969H15.7188V8.59766ZM4.28516 11.4336H2.86719V10.0156H4.28516V11.4336ZM7.12109 11.4336H5.70312V10.0156H7.12109V11.4336ZM9.98828 11.4336H8.57031V10.0156H9.98828V11.4336ZM12.8516 11.4336H11.4336V10.0156H12.8516V11.4336ZM15.7188 11.4336H14.3008V10.0156H15.7188V11.4336ZM4.28516 14.3008H2.86719V12.8828H4.28516V14.3008ZM7.12109 14.3008H5.70312V12.8828H7.12109V14.3008ZM9.98828 14.3008H8.57031V12.8828H9.98828V14.3008ZM12.8516 14.3008H11.4336V12.8828H12.8516V14.3008ZM15.7188 14.3008H14.3008V12.8828H15.7188V14.3008ZM4.28516 17.1641H2.86719V15.7461H4.28516V17.1641ZM7.12109 17.1641H5.70312V15.7461H7.12109V17.1641ZM9.98828 17.1641H8.57031V15.7461H9.98828V17.1641ZM12.8516 17.1641H11.4336V15.7461H12.8516V17.1641Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Date</OptionTitle>
        </OptionInfo>
        <Controller
          control={control}
          name="dueDate"
          render={({ field: { onChange } }) => {
            setDueDateRef.current = onChange;
            return (
              <CategoryLabel>
                <LabelText>
                  {toFormattedDateString(dueDate) === toFormattedDateString(TODAYS_DATE)
                    ? 'Today'
                    : toFormattedDateString(dueDate)}
                </LabelText>
              </CategoryLabel>
            );
          }}
        />
      </OptionContainer>
      <OptionContainer onPress={toggleRemindersModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 22" fill="none">
            <Path
              d="M8.9375 0.6875C8.9375 0.309375 9.24688 0 9.625 0C10.0031 0 10.3125 0.309375 10.3125 0.6875V1.40937C13.7887 1.75312 16.5 4.68359 16.5 8.25V9.50039C16.5 11.3781 17.2477 13.1785 18.5754 14.5105L18.6957 14.6309C19.0523 14.9875 19.2543 15.473 19.2543 15.9758C19.2543 17.0285 18.4035 17.8793 17.3508 17.8793H1.90352C0.850781 17.875 0 17.0242 0 15.9715C0 15.4688 0.201953 14.9832 0.558594 14.6266L0.678906 14.5063C2.00234 13.1785 2.75 11.3781 2.75 9.50039V8.25C2.75 4.68359 5.46133 1.75312 8.9375 1.40937V0.6875ZM9.625 2.75C6.58711 2.75 4.125 5.21211 4.125 8.25V9.50039C4.125 11.7434 3.23555 13.8961 1.6457 15.4816L1.52969 15.5977C1.43086 15.6965 1.375 15.8297 1.375 15.9715C1.375 16.2637 1.61133 16.5 1.90352 16.5H17.3465C17.6387 16.5 17.875 16.2637 17.875 15.9715C17.875 15.8297 17.8191 15.6965 17.7203 15.5977L17.6 15.4773C16.0145 13.8918 15.1207 11.7391 15.1207 9.49609V8.25C15.1207 5.21211 12.6586 2.75 9.6207 2.75H9.625ZM8.32734 19.7098C8.51641 20.2426 9.02774 20.625 9.625 20.625C10.2223 20.625 10.7336 20.2426 10.9227 19.7098C11.0473 19.3531 11.4426 19.1641 11.7992 19.2887C12.1559 19.4133 12.3449 19.8086 12.2203 20.1652C11.8422 21.2352 10.8238 22 9.625 22C8.42617 22 7.40781 21.2352 7.02969 20.1652C6.90508 19.8086 7.08984 19.4133 7.45078 19.2887C7.81172 19.1641 8.20274 19.3488 8.32734 19.7098Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Time and reminders</OptionTitle>
        </OptionInfo>
        <CategoryLabel>
          <LabelText>
            {!!reminders.length
              ? reminders.length + (reminders.length === 1 ? ' reminder' : ' reminders')
              : '---'}
          </LabelText>
        </CategoryLabel>
      </OptionContainer>
      <OptionContainer onPress={toggleChecklistModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 15 20" fill="none">
            <Path
              d="M13.125 2.5H11.875H10.5625C10.2734 1.07422 9.01172 0 7.5 0C5.98828 0 4.72656 1.07422 4.4375 2.5H3.125H1.875H0V4.375V18.125V20H1.875H13.125H15V18.125V4.375V2.5H13.125ZM3.125 4.375V6.25H7.5H11.875V4.375H13.125V18.125H1.875V4.375H3.125ZM6.5625 3.125C6.5625 2.87636 6.66127 2.6379 6.83709 2.46209C7.0129 2.28627 7.25136 2.1875 7.5 2.1875C7.74864 2.1875 7.9871 2.28627 8.16291 2.46209C8.33873 2.6379 8.4375 2.87636 8.4375 3.125C8.4375 3.37364 8.33873 3.6121 8.16291 3.78791C7.9871 3.96373 7.74864 4.0625 7.5 4.0625C7.25136 4.0625 7.0129 3.96373 6.83709 3.78791C6.66127 3.6121 6.5625 3.37364 6.5625 3.125ZM6.69141 9.19141L7.13281 8.75L6.25 7.86719L5.80859 8.30859L4.375 9.74219L3.87891 9.24609L3.4375 8.80469L2.55469 9.6875L2.99609 10.1289L3.93359 11.0664L4.375 11.5078L4.81641 11.0664L6.69141 9.19141ZM7.5 10V11.25H8.125H11.25H11.875V10H11.25H8.125H7.5ZM6.875 13.75H6.25V15H6.875H11.25H11.875V13.75H11.25H6.875ZM4.375 15.3125C4.62364 15.3125 4.8621 15.2137 5.03791 15.0379C5.21373 14.8621 5.3125 14.6236 5.3125 14.375C5.3125 14.1264 5.21373 13.8879 5.03791 13.7121C4.8621 13.5363 4.62364 13.4375 4.375 13.4375C4.12636 13.4375 3.8879 13.5363 3.71209 13.7121C3.53627 13.8879 3.4375 14.1264 3.4375 14.375C3.4375 14.6236 3.53627 14.8621 3.71209 15.0379C3.8879 15.2137 4.12636 15.3125 4.375 15.3125Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Checklist</OptionTitle>
        </OptionInfo>
        <CategoryLabel>
          <LabelText>
            {checklist.length} sub {checklist.length === 1 ? 'task' : 'tasks'}
          </LabelText>
        </CategoryLabel>
      </OptionContainer>
      <OptionContainer onPress={togglePriorityModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 18 20" fill="none">
            <Path
              d="M1.875 0.9375C1.875 0.417969 1.45703 0 0.9375 0C0.417969 0 0 0.417969 0 0.9375V2.5V13.6914V15.625V19.0625C0 19.582 0.417969 20 0.9375 20C1.45703 20 1.875 19.582 1.875 19.0625V15.1562L5.01172 14.3711C6.61719 13.9688 8.31641 14.1562 9.79688 14.8945C11.5234 15.7578 13.5273 15.8633 15.332 15.1836L16.6875 14.6758C17.1758 14.4922 17.5 14.0273 17.5 13.5039V2.58203C17.5 1.68359 16.5547 1.09766 15.75 1.5L15.375 1.6875C13.5664 2.59375 11.4375 2.59375 9.62891 1.6875C8.25781 1 6.68359 0.828125 5.19531 1.19922L1.875 2.03125V0.9375ZM1.875 3.96484L5.64844 3.01953C6.70312 2.75781 7.81641 2.87891 8.78906 3.36328C10.9336 4.43359 13.4258 4.52344 15.625 3.62891V13.0742L14.6719 13.4297C13.3555 13.9219 11.8906 13.8477 10.6328 13.2188C8.75 12.2773 6.59766 12.043 4.55469 12.5508L1.875 13.2227V3.96484Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Priority</OptionTitle>
        </OptionInfo>
        <CategoryLabel>
          <LabelText>{priority}</LabelText>
        </CategoryLabel>
      </OptionContainer>
      {isRecurring && (
        <OptionContainer onPress={toggleFrequencyModal}>
          <OptionInfo>
            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
              <Path
                d="M0 9.625V4.125V2.75H1.375H13.75V0H15.125L19.25 4.125L15.125 8.25H13.75V5.5H2.75V9.625V11H0V9.625ZM22 12.375V17.875V19.25H20.625H8.25V22H6.875L2.75 17.875L6.875 13.75H8.25V16.5H19.25V12.375V11H22V12.375Z"
                fill="#C73A57"
              />
            </Svg>
            <OptionTitle>Frequency</OptionTitle>
          </OptionInfo>
          <FrequencyBadge frequency={frequency!} isForm />
        </OptionContainer>
      )}
      <OptionContainer onPress={toggleNoteModal}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 20" fill="none">
            <Path
              d="M17.8924 1.63141L18.3686 2.10765C18.8606 2.59963 18.8606 3.3986 18.3686 3.89058L17.3177 4.94145L15.0585 2.68228L16.1094 1.63141C16.6014 1.13943 17.4004 1.13943 17.8924 1.63141ZM7.43875 10.3021L14.169 3.57178L16.4282 5.83096L9.69792 12.5613C9.53262 12.7266 9.32008 12.8446 9.0918 12.8997L6.50989 13.494L7.1042 10.9082C7.15537 10.6799 7.27344 10.4674 7.44269 10.3021H7.43875ZM15.2199 0.737971L6.54925 9.41258C6.2147 9.74712 5.98249 10.1683 5.87622 10.6288L5.05363 14.1946C5.0064 14.4072 5.06937 14.6276 5.22287 14.7811C5.37637 14.9346 5.59677 14.9975 5.80931 14.9503L9.37519 14.1277C9.83568 14.0215 10.2568 13.7892 10.5914 13.4547L19.262 4.78009C20.246 3.79612 20.246 2.20211 19.262 1.21814L18.7858 0.737971C17.8018 -0.24599 16.2078 -0.24599 15.2239 0.737971H15.2199ZM3.14868 2.36741C1.40903 2.36741 0 3.77644 0 5.51609V16.8513C0 18.591 1.40903 20 3.14868 20H14.4839C16.2236 20 17.6326 18.591 17.6326 16.8513V11.8134C17.6326 11.4671 17.3492 11.1837 17.0029 11.1837C16.6565 11.1837 16.3731 11.4671 16.3731 11.8134V16.8513C16.3731 17.8943 15.5269 18.7405 14.4839 18.7405H3.14868C2.10568 18.7405 1.25947 17.8943 1.25947 16.8513V5.51609C1.25947 4.47309 2.10568 3.62688 3.14868 3.62688H8.18656C8.53291 3.62688 8.81629 3.3435 8.81629 2.99715C8.81629 2.65079 8.53291 2.36741 8.18656 2.36741H3.14868Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTitle>Note</OptionTitle>
        </OptionInfo>
        <Text color="#C73A57">{toTruncatedText(note, 16)}</Text>
      </OptionContainer>
      <OptionContainer onPress={() => setIsCarriedOverRef.current?.(!isCarriedOver)}>
        <OptionInfo>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 21" fill="none">
            <Path
              d="M10.9316 18.9131C11.4919 18.8388 11.9346 19.3867 11.7447 19.9193C11.6455 20.1893 11.4149 20.3788 11.1289 20.4167C10.4706 20.5014 9.80563 20.5216 9.14343 20.4769C6.70039 20.3124 4.50235 19.2538 2.87405 17.6255C1.09843 15.8499 0 13.3967 0 10.6876C0 7.97801 1.09843 5.52521 2.87405 3.74959C4.64967 1.97397 7.10248 0.875536 9.81202 0.875536C10.7514 0.875536 11.667 1.01074 12.5395 1.26278C13.2554 1.46933 13.9452 1.75739 14.5953 2.12128L14.4019 1.61486C14.2405 1.19049 14.4535 0.715715 14.8775 0.553939C15.3018 0.392555 15.7766 0.60552 15.9384 1.02989L16.7558 3.16891C16.7867 3.2503 16.8046 3.33599 16.809 3.42291C16.8731 3.82149 16.6343 4.21655 16.2373 4.3369L14.0479 5.00667C13.6145 5.13796 13.1569 4.89334 13.0256 4.46038C12.8943 4.02742 13.139 3.56945 13.5719 3.43815L13.7521 3.38305C13.2331 3.10217 12.6855 2.87789 12.1187 2.71407C11.393 2.50462 10.6193 2.39208 9.81202 2.39208C7.52138 2.39208 5.44721 3.32053 3.9463 4.82184C2.44499 6.32275 1.51654 8.39652 1.51654 10.6876C1.51654 12.9782 2.44499 15.052 3.9463 16.5533C5.30654 17.9135 7.13726 18.8037 9.17351 18.9584C9.75575 19.0026 10.3548 18.9881 10.9316 18.9131ZM8.30993 6.69671C8.30993 6.2782 8.6495 5.93863 9.0684 5.93863C9.48691 5.93863 9.82648 6.2782 9.82648 6.69671V11.3124L12.9858 12.7011C13.3687 12.8696 13.5422 13.3166 13.3738 13.6995C13.2054 14.0821 12.7584 14.256 12.3754 14.0876L8.80151 12.5167C8.5143 12.4085 8.30993 12.1314 8.30993 11.8067V6.69671ZM13.5735 18.1026C12.9631 18.4149 13.0444 19.3101 13.702 19.5066C13.8923 19.5606 14.0819 19.5442 14.2593 19.4555C14.7485 19.2097 15.2182 18.9201 15.6586 18.595C15.8735 18.4348 15.9853 18.1824 15.9622 17.9155C15.9036 17.3258 15.2323 17.0269 14.7551 17.377C14.3826 17.6521 13.9873 17.8948 13.5735 18.1026ZM16.6668 15.3849C16.3213 15.8999 16.7093 16.5924 17.3299 16.565C17.5725 16.5521 17.7898 16.4333 17.9258 16.2301C18.2329 15.7745 18.4983 15.2974 18.7257 14.7972C18.9449 14.3033 18.6034 13.75 18.0629 13.7269C17.7531 13.7167 17.4725 13.8898 17.3436 14.1724C17.1509 14.5963 16.927 14.9988 16.6668 15.3849ZM18.0602 11.496C18.0329 11.7938 18.1774 12.0728 18.4349 12.224C18.9179 12.4983 19.5135 12.1912 19.5701 11.6391C19.6221 11.0912 19.6303 10.5488 19.5928 9.99981C19.574 9.73605 19.4216 9.50355 19.1872 9.38046C18.6612 9.10771 18.0379 9.51566 18.0797 10.1061C18.1118 10.5719 18.1044 11.031 18.0602 11.496ZM17.4319 7.41727C17.6018 7.80921 18.0579 7.98544 18.4459 7.80647C18.8198 7.63454 18.9875 7.19649 18.8253 6.81824C18.6104 6.31454 18.3517 5.83039 18.0559 5.36929C17.6843 4.798 16.8098 4.96446 16.6746 5.63306C16.6374 5.82961 16.6726 6.02147 16.7809 6.19067C17.0317 6.58222 17.2498 6.98939 17.4319 7.41727Z"
              fill="#C73A57"
            />
          </Svg>
          <OptionTextContainer>
            <OptionTitle>Pending Task</OptionTitle>
            <OptionSubtitle>It will be shown each day until completed.</OptionSubtitle>
          </OptionTextContainer>
        </OptionInfo>
        <Controller
          control={control}
          name="isCarriedOver"
          render={({ field: { onChange } }) => {
            setIsCarriedOverRef.current = onChange;
            return <CircularCheckbox isChecked={isChecked} />;
          }}
        />
      </OptionContainer>

      <ButtonsContainer>
        <Button onPress={() => router.replace('/tasks')}>
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText color="#C73A57">CONFIRM</ButtonText>
        </Button>
      </ButtonsContainer>

      <ModalContainer isOpen={isTitleOpen} closeModal={toggleTitleModal}>
        <TextModalModule
          control={control}
          name="title"
          previousText={title}
          closeModal={toggleTitleModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isCategoryOpen} closeModal={toggleCategoryModal}>
        <CategoryModalModule control={control} closeModal={toggleCategoryModal} />
      </ModalContainer>
      <ModalContainer isOpen={isRemindersOpen} closeModal={toggleRemindersModal}>
        <RemindersModalModule
          control={control as any}
          reminders={reminders}
          closeModal={toggleRemindersModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isChecklistOpen} closeModal={toggleChecklistModal}>
        <ChecklistModalModule
          isForm
          control={control}
          checklist={checklist}
          closeModal={toggleChecklistModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isPriorityOpen} closeModal={togglePriorityModal}>
        <PriorityModalModule
          isForm
          control={control}
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
      <ModalContainer isOpen={isNoteOpen} closeModal={toggleNoteModal}>
        <TextModalModule
          control={control}
          name="note"
          previousText={note}
          closeModal={toggleNoteModal}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
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

const Row = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const CategoryContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
  backgroundColor: '#C73A57',
  borderRadius: 8,
});

const CategoryLabel = styled(View, {
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

const OptionTextContainer = styled(View, {
  justifyContent: 'center',
});

const OptionTitle = styled(Text, {
  fontSize: 16,
});

const OptionSubtitle = styled(Text, {
  fontSize: 12,
  color: '#8c8c8c',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  backgroundColor: '#1C1C1C',
  borderTopWidth: 1,
  borderColor: '#262626',
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

export default EditTask;

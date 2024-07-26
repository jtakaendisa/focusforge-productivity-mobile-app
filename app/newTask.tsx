import { zodResolver } from '@hookform/resolvers/zod';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { getTokenValue, styled, Text, View } from 'tamagui';
import { z } from 'zod';

import BellSvg from './components/icons/BellSvg';
import BinSvg from './components/icons/BinSvg';
import CalendarEndSvg from './components/icons/CalendarEndSvg';
import CalendarStartSvg from './components/icons/CalendarStartSvg';
import CalendarSvg from './components/icons/CalendarSvg';
import ChecklistSvg from './components/icons/ChecklistSvg';
import FlagSvg from './components/icons/FlagSvg';
import LoopSvg from './components/icons/LoopSvg';
import PendingSvg from './components/icons/PendingSvg';
import PenToSquareSvg from './components/icons/PenToSquareSvg';
import SquareGridSvg from './components/icons/SquareGridSvg';
import CategoryIcon from './components/tabs/CategoryIcon';
import CircularCheckbox from './components/tabs/CircularCheckbox';
import FrequencyBadge from './components/tabs/habits/FrequencyBadge';
import FrequencyListModule from './components/tabs/habits/FrequencyListModule';
import CategoryModalModule from './components/tabs/modals/CategoryModalModule';
import ChecklistModalModule from './components/tabs/modals/ChecklistModalModule';
import ModalContainer from './components/tabs/modals/ModalContainer';
import PriorityModalModule from './components/tabs/modals/PriorityModalModule';
import RemindersModalModule from './components/tabs/modals/RemindersModalModule';
import TextModalModule from './components/tabs/modals/TextModalModule';
import { TODAYS_DATE } from './constants';
import { useTaskStore } from './store';
import { toFormattedDateString, toTruncatedText } from './utils';
import { taskSchema } from './validationSchemas';

type SearchParams = {
  isRecurring: string;
  origin: '/' | '/habits' | '/tasks';
};

export type NewTaskData = z.infer<typeof taskSchema>;

const SVG_SIZE = 22;

const NewTaskScreen = () => {
  const { isRecurring: isRecurringString, origin } =
    useLocalSearchParams<SearchParams>();

  const isRecurring: boolean = JSON.parse(isRecurringString);

  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);

  const [modalState, setModalState] = useState({
    isCategoryOpen: false,
    isRemindersOpen: false,
    isChecklistOpen: false,
    isPriorityOpen: false,
    isFrequencyOpen: false,
    isNoteOpen: false,
  });

  const setDueDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setIsCarriedOverRef = useRef<((...event: any[]) => void) | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewTaskData>({
    defaultValues: {
      title: '',
      category: 'Task',
      [isRecurring ? 'startDate' : 'dueDate']: TODAYS_DATE,
      priority: 'Normal',
      reminders: [],
      frequency: isRecurring
        ? {
            type: 'daily',
          }
        : undefined,
      checklist: [],
      note: '',
      isCarriedOver: isRecurring ? false : true,
    },
    resolver: zodResolver(taskSchema),
  });

  const watchAllFields = watch();

  const {
    isCategoryOpen,
    isRemindersOpen,
    isChecklistOpen,
    isPriorityOpen,
    isFrequencyOpen,
    isNoteOpen,
  } = modalState;

  const {
    category,
    dueDate,
    startDate,
    endDate,
    checklist,
    priority,
    frequency,
    reminders,
    note,
    isCarriedOver,
  } = watchAllFields;

  const isChecked = useSharedValue(isCarriedOver ? 1 : 0);

  const customBlack1 = getTokenValue('$customBlack1');
  const customRed1 = getTokenValue('$customRed1');

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    mode: 'start' | 'end'
  ) => {
    if (selectedDate) {
      if (mode === 'start') {
        setDueDateRef.current?.(selectedDate);
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

  const handleEndDateClear = () => setEndDateRef.current?.();

  const showDatePicker = (mode: 'start' | 'end') => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, date) => handleDateSelect(e, date, mode),
      is24Hour: true,
      minimumDate: TODAYS_DATE,
    });
  };

  const onSubmit: SubmitHandler<NewTaskData> = (data) => {
    const newTask = {
      id: uuid.v4() as string,
      isCompleted: false,
      isRecurring,
      ...data,
    };
    setTasks([...tasks, newTask]);
  };

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
    router.replace(origin);
  }, [isSubmitSuccessful]);

  const customGray1 = getTokenValue('$customGray1');

  return (
    <Container>
      <ScreenLabel>
        <LabelTextLarge>New Task</LabelTextLarge>
      </ScreenLabel>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TitleInputField
            placeholder="Task Title..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoFocus
          />
        )}
      />
      <OptionContainer onPress={toggleCategoryModal}>
        <OptionInfo>
          <SquareGridSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Category</OptionTitle>
        </OptionInfo>
        <Row>
          <Text color={customRed1}>{category}</Text>
          <CategoryContainer>
            <CategoryIcon category={category} fill={customBlack1} />
          </CategoryContainer>
        </Row>
      </OptionContainer>
      <OptionContainer onPress={() => showDatePicker('start')}>
        <OptionInfo>
          {isRecurring ? (
            <CalendarStartSvg size={SVG_SIZE} fill={customRed1} />
          ) : (
            <CalendarSvg size={SVG_SIZE} fill={customRed1} />
          )}
          <OptionTitle>{isRecurring ? 'Start Date' : 'Due Date'}</OptionTitle>
        </OptionInfo>
        <Controller
          control={control}
          name={isRecurring ? 'startDate' : 'dueDate'}
          render={({ field: { onChange } }) => {
            setDueDateRef.current = onChange;
            return (
              <CategoryLabel>
                <LabelText>
                  {toFormattedDateString(isRecurring ? startDate! : dueDate!) ===
                  toFormattedDateString(TODAYS_DATE)
                    ? 'Today'
                    : toFormattedDateString(isRecurring ? startDate! : dueDate!)}
                </LabelText>
              </CategoryLabel>
            );
          }}
        />
      </OptionContainer>

      {isRecurring && (
        <OptionContainer onPress={() => showDatePicker('end')}>
          <OptionInfo>
            <CalendarEndSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>End date</OptionTitle>
          </OptionInfo>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange } }) => {
              setEndDateRef.current = onChange;
              return (
                <Row>
                  {endDate && (
                    <AnimatedIconContainer
                      onPress={handleEndDateClear}
                      entering={FadeIn}
                      exiting={FadeOut}
                    >
                      <BinSvg size={SVG_SIZE / 1.2} fill={customGray1} />
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
                </Row>
              );
            }}
          />
        </OptionContainer>
      )}

      <OptionContainer onPress={toggleRemindersModal}>
        <OptionInfo>
          <BellSvg size={SVG_SIZE} fill={customRed1} />
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
          <ChecklistSvg size={SVG_SIZE} fill={customRed1} />
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
          <FlagSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
          <OptionTitle>Priority</OptionTitle>
        </OptionInfo>
        <CategoryLabel>
          <LabelText>{priority}</LabelText>
        </CategoryLabel>
      </OptionContainer>
      {isRecurring && (
        <OptionContainer onPress={toggleFrequencyModal}>
          <OptionInfo>
            <LoopSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Frequency</OptionTitle>
          </OptionInfo>
          <FrequencyBadge frequency={frequency!} isForm />
        </OptionContainer>
      )}
      <OptionContainer onPress={toggleNoteModal}>
        <OptionInfo>
          <PenToSquareSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
          <OptionTitle>Note</OptionTitle>
        </OptionInfo>
        <Text color={customRed1}>{toTruncatedText(note, 16)}</Text>
      </OptionContainer>
      {!isRecurring && (
        <OptionContainer onPress={() => setIsCarriedOverRef.current?.(!isCarriedOver)}>
          <OptionInfo>
            <PendingSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTextContainer>
              <OptionTitle>Pending Task</OptionTitle>
              <OptionSubtitle>
                It will be shown each day until completed.
              </OptionSubtitle>
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
      )}
      <ButtonsContainer>
        <Button onPress={() => router.replace(origin)}>
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText color={customRed1}>CONFIRM</ButtonText>
        </Button>
      </ButtonsContainer>

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
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

const ScreenLabel = styled(View, {
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginLeft: 8,
  borderRadius: 6,
  backgroundColor: '$customGray2',
});

const LabelTextLarge = styled(Text, {
  fontSize: 18,
  fontWeight: 'bold',
});

const TitleInputField = styled(TextInput, {
  height: 48,
  paddingHorizontal: 16,
  paddingVertical: 6,
  marginHorizontal: 8,
  marginVertical: 28,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '$customRed1',
  placeholderTextColor: 'white',
  //@ts-ignore
  fontSize: 16,
  color: 'white',
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

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
});

const OptionInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

const OptionTextContainer = styled(View, {
  justifyContent: 'center',
});

const OptionTitle = styled(Text, {
  fontSize: 16,
});

const OptionSubtitle = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
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
  backgroundColor: '$customRed1',
  borderRadius: 8,
});

const CategoryLabel = styled(View, {
  paddingHorizontal: 26,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: '$customRed5',
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

export default NewTaskScreen;

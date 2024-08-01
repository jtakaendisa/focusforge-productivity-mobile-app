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
import { CURRENT_DATE } from './constants';
import { Activity, NewActivityData } from './entities';
import { useActivityStore } from './store';
import { toCleanedObject, toFormattedDateString, toTruncatedText } from './utils';
import { activitySchema } from './validationSchemas';
import RippleButton from './components/tabs/RippleButton';

type SearchParams = {
  isRecurring: string;
  origin: '/' | '/habits' | '/tasks';
};

const SVG_SIZE = 22;

const NewTaskScreen = () => {
  const { isRecurring: isRecurringString, origin } =
    useLocalSearchParams<SearchParams>();

  const isRecurring: boolean = JSON.parse(isRecurringString);

  const activities = useActivityStore((s) => s.activities);
  const setActivities = useActivityStore((s) => s.setActivities);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const setStartDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setIsCarriedOverRef = useRef<((...event: any[]) => void) | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewActivityData>({
    defaultValues: {
      title: '',
      category: 'Task',
      [isRecurring ? 'startDate' : 'endDate']: CURRENT_DATE,
      priority: 'Normal',
      frequency: {
        type: isRecurring ? 'daily' : 'once',
      },
      isCarriedOver: isRecurring ? false : true,
    },
    resolver: zodResolver(activitySchema),
  });

  const watchAllFields = watch();

  const {
    category,
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
  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    mode: 'start' | 'end'
  ) => {
    if (selectedDate) {
      if (mode === 'start') {
        setStartDateRef.current?.(selectedDate);
      } else {
        if (isRecurring) {
          if (
            toFormattedDateString(selectedDate) !== toFormattedDateString(CURRENT_DATE)
          ) {
            setEndDateRef.current?.(selectedDate);
          } else {
            setEndDateRef.current?.();
          }
        } else {
          setEndDateRef.current?.(selectedDate);
        }
      }
    }
  };

  const showDatePicker = (mode: 'start' | 'end') => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, date) => handleDateSelect(e, date, mode),
      is24Hour: true,
      minimumDate: CURRENT_DATE,
    });
  };

  const handleStartDateSelect = () => showDatePicker('start');

  const handleEndDateSelect = () => showDatePicker('end');

  const handleEndDateClear = () => setEndDateRef.current?.();

  const onSubmit: SubmitHandler<NewActivityData> = (data) => {
    const newTask: Activity = {
      id: uuid.v4() as string,
      type: isRecurring ? 'recurring task' : 'single task',
      isCompleted: false,
      ...data,
    };
    setActivities([...activities, toCleanedObject(newTask)]);
  };

  const handleCancel = () => router.replace(origin);

  const togglePendingTaskOption = () => setIsCarriedOverRef.current?.(!isCarriedOver);

  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);

  const toggleRemindersModal = () => setIsRemindersModalOpen((prev) => !prev);

  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleFrequencyModal = () => setIsFrequencyModalOpen((prev) => !prev);

  const toggleNoteModal = () => setIsNoteModalOpen((prev) => !prev);

  useEffect(() => {
    isChecked.value = isCarriedOver ? withTiming(1) : withTiming(0);
  }, [isCarriedOver]);

  useEffect(() => {
    if (!isSubmitSuccessful) return;

    reset();
    router.replace(origin);
  }, [isSubmitSuccessful]);

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
      <RippleButton onPress={toggleCategoryModal}>
        <OptionContainer>
          <OptionInfo>
            <SquareGridSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Category</OptionTitle>
          </OptionInfo>
          <Row>
            <Text color="$customRed1">{category}</Text>
            <CategoryContainer>
              <CategoryIcon category={category} fill={customBlack1} />
            </CategoryContainer>
          </Row>
        </OptionContainer>
      </RippleButton>

      {isRecurring && (
        <RippleButton onPress={handleStartDateSelect}>
          <OptionContainer>
            <OptionInfo>
              <CalendarStartSvg size={SVG_SIZE} fill={customRed1} />
              <OptionTitle>Start Date</OptionTitle>
            </OptionInfo>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange } }) => {
                setStartDateRef.current = onChange;
                return (
                  <OptionLabel>
                    <LabelText>
                      {startDate &&
                        (toFormattedDateString(startDate) ===
                        toFormattedDateString(CURRENT_DATE)
                          ? 'Today'
                          : toFormattedDateString(startDate))}
                    </LabelText>
                  </OptionLabel>
                );
              }}
            />
          </OptionContainer>
        </RippleButton>
      )}

      <RippleButton onPress={handleEndDateSelect}>
        <OptionContainer>
          <OptionInfo>
            {isRecurring ? (
              <CalendarEndSvg size={SVG_SIZE} fill={customRed1} />
            ) : (
              <CalendarSvg size={SVG_SIZE} fill={customRed1} />
            )}
            <OptionTitle>{isRecurring ? 'End date' : 'Due Date'}</OptionTitle>
          </OptionInfo>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange } }) => {
              setEndDateRef.current = onChange;
              return (
                <Row>
                  {endDate && isRecurring && (
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
                          toFormattedDateString(CURRENT_DATE)
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
      </RippleButton>

      <RippleButton onPress={toggleRemindersModal}>
        <OptionContainer>
          <OptionInfo>
            <BellSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Time and reminders</OptionTitle>
          </OptionInfo>
          <OptionLabel>
            <LabelText>
              {!!reminders?.length
                ? reminders.length +
                  (reminders.length === 1 ? ' reminder' : ' reminders')
                : '---'}
            </LabelText>
          </OptionLabel>
        </OptionContainer>
      </RippleButton>
      <RippleButton onPress={toggleChecklistModal}>
        <OptionContainer>
          <OptionInfo>
            <ChecklistSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Checklist</OptionTitle>
          </OptionInfo>
          <OptionLabel>
            <LabelText>
              {!!checklist?.length
                ? checklist.length +
                  (checklist.length === 1 ? ' sub task' : ' sub tasks')
                : '---'}
            </LabelText>
          </OptionLabel>
        </OptionContainer>
      </RippleButton>
      <RippleButton onPress={togglePriorityModal}>
        <OptionContainer>
          <OptionInfo>
            <FlagSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
            <OptionTitle>Priority</OptionTitle>
          </OptionInfo>
          <OptionLabel>
            <LabelText>{priority}</LabelText>
          </OptionLabel>
        </OptionContainer>
      </RippleButton>
      {isRecurring && (
        <RippleButton onPress={toggleFrequencyModal}>
          <OptionContainer>
            <OptionInfo>
              <LoopSvg size={SVG_SIZE} fill={customRed1} />
              <OptionTitle>Frequency</OptionTitle>
            </OptionInfo>
            <FrequencyBadge frequency={frequency!} isForm />
          </OptionContainer>
        </RippleButton>
      )}
      <RippleButton onPress={toggleNoteModal}>
        <OptionContainer>
          <OptionInfo>
            <PenToSquareSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
            <OptionTitle>Note</OptionTitle>
          </OptionInfo>
          {note && <Text color="$customRed1">{toTruncatedText(note, 16)}</Text>}
        </OptionContainer>
      </RippleButton>
      {!isRecurring && (
        <RippleButton onPress={togglePendingTaskOption}>
          <OptionContainer>
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
        </RippleButton>
      )}
      <ButtonsContainer>
        <RippleButton flex onPress={handleCancel}>
          <Button>
            <ButtonText>CANCEL</ButtonText>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={handleSubmit(onSubmit)}>
          <Button>
            <ButtonText color="$customRed1">CONFIRM</ButtonText>
          </Button>
        </RippleButton>
      </ButtonsContainer>

      <ModalContainer isOpen={isCategoryModalOpen} closeModal={toggleCategoryModal}>
        <CategoryModalModule control={control} closeModal={toggleCategoryModal} />
      </ModalContainer>
      <ModalContainer isOpen={isRemindersModalOpen} closeModal={toggleRemindersModal}>
        <RemindersModalModule
          control={control}
          reminders={reminders}
          closeModal={toggleRemindersModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isChecklistModalOpen} closeModal={toggleChecklistModal}>
        <ChecklistModalModule
          control={control}
          checklist={checklist}
          closeModal={toggleChecklistModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isPriorityModalOpen} closeModal={togglePriorityModal}>
        <PriorityModalModule
          control={control}
          initialPriority={priority}
          closeModal={togglePriorityModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isFrequencyModalOpen} closeModal={toggleFrequencyModal}>
        <FrequencyListModule
          isModal
          control={control}
          closeModal={toggleFrequencyModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isNoteModalOpen} closeModal={toggleNoteModal}>
        <TextModalModule
          control={control}
          name="note"
          initialText={note}
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

const OptionLabel = styled(View, {
  paddingHorizontal: 26,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: '$customRed5',
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
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

const ButtonText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

const AnimatedIconContainer = Animated.createAnimatedComponent(IconContainer);

export default NewTaskScreen;

import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CURRENT_DATE } from '@/app/constants';
import { Task } from '@/app/entities';
import { NewTaskData } from '@/app/newTask';
import { useTaskStore } from '@/app/store';
import { toFormattedDateString, toTruncatedText } from '@/app/utils';
import { taskSchema } from '@/app/validationSchemas';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';
import BellSvg from '../../icons/BellSvg';
import CalendarEndSvg from '../../icons/CalendarEndSvg';
import CalendarStartSvg from '../../icons/CalendarStartSvg';
import CalendarSvg from '../../icons/CalendarSvg';
import ChecklistSvg from '../../icons/ChecklistSvg';
import FlagSvg from '../../icons/FlagSvg';
import LoopSvg from '../../icons/LoopSvg';
import PenSvg from '../../icons/PenSvg';
import PenToSquareSvg from '../../icons/PenToSquareSvg';
import PendingSvg from '../../icons/PendingSvg';
import SquareGridSvg from '../../icons/SquareGridSvg';
import CategoryIcon from '../CategoryIcon';
import CircularCheckbox from '../CircularCheckbox';
import FrequencyBadge from '../habits/FrequencyBadge';
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
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);
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
    startDate,
    endDate,
    checklist,
    priority,
    note,
    isCarriedOver,
    frequency,
    reminders,
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
          toFormattedDateString(selectedDate) !== toFormattedDateString(CURRENT_DATE)
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
      minimumDate: CURRENT_DATE,
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
          <PenSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Title</OptionTitle>
        </OptionInfo>
        <Text color="$customGray1">{toTruncatedText(title, 24)}</Text>
      </OptionContainer>
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
                  toFormattedDateString(CURRENT_DATE)
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
            <OptionTitle>End Date</OptionTitle>
          </OptionInfo>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange } }) => {
              setEndDateRef.current = onChange;
              return (
                <CategoryLabel>
                  <LabelText>
                    {endDate
                      ? toFormattedDateString(endDate) ===
                        toFormattedDateString(CURRENT_DATE)
                        ? 'Today'
                        : toFormattedDateString(endDate)
                      : '---'}
                  </LabelText>
                </CategoryLabel>
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
      <OptionContainer onPress={() => setIsCarriedOverRef.current?.(!isCarriedOver)}>
        <OptionInfo>
          <PendingSvg size={SVG_SIZE} fill={customRed1} />
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
          <ButtonText color={customRed1}>CONFIRM</ButtonText>
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
  borderColor: '$customGray2',
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
  backgroundColor: '$customRed1',
  borderRadius: 8,
});

const CategoryLabel = styled(View, {
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

export default EditTask;

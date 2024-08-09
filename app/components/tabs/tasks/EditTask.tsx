import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CURRENT_DATE } from '@/app/constants';
import { Activity, NewActivityData } from '@/app/entities';
import { useActivityStore } from '@/app/store';
import {
  generateCompletionDates,
  getCompletionDatesFromStorage,
  mergeCompletionDates,
  setCompletionDatesInStorage,
  toCleanedObject,
  toFormattedDateString,
  toTruncatedText,
} from '@/app/utils';
import { activitySchema } from '@/app/validationSchemas';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, View, getTokenValue, styled } from 'tamagui';
import BellSvg from '../../icons/BellSvg';
import BinSvg from '../../icons/BinSvg';
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
import RippleButton from '../RippleButton';
import FrequencyBadge from '../habits/FrequencyBadge';
import FrequencyListModule from '../habits/FrequencyListModule';
import CategoryModalModule from '../modals/CategoryModalModule';
import ChecklistModalModule from '../modals/ChecklistModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import RemindersModalModule from '../modals/RemindersModalModule';
import TextModalModule from '../modals/TextModalModule';

interface Props {
  activities: Activity[];
  selectedTask: Activity;
  isRecurring: boolean;
}

const SVG_SIZE = 22;

const EditTask = ({ activities, selectedTask, isRecurring }: Props) => {
  const setActivities = useActivityStore((s) => s.setActivities);

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);

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
      ...selectedTask,
    },
    resolver: zodResolver(activitySchema),
  });

  const watchAllFields = watch();

  const {
    title,
    category,
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

  const onSubmit: SubmitHandler<NewActivityData> = async (data) => {
    const updatedTask: Activity = {
      ...selectedTask,
      ...data,
    };

    if (isRecurring) {
      // Retrieve the current completion dates map from storage
      const currentCompletionDatesMap = await getCompletionDatesFromStorage();

      // Retrieve existing completion dates for the selected habit
      const existingCompletionDates = currentCompletionDatesMap[selectedTask.id];

      // Generate new completion dates based on the updated data
      const newCompletionDates = generateCompletionDates(
        data.startDate!,
        data.frequency,
        data.endDate
      );

      // Merge existing completion dates with new ones, ensuring no duplicates
      const mergedCompletionDates = mergeCompletionDates(
        existingCompletionDates,
        newCompletionDates
      );

      // Update the map with the new activity
      currentCompletionDatesMap[selectedTask.id] = mergedCompletionDates;

      // Store the updated map back to local storage
      await setCompletionDatesInStorage(currentCompletionDatesMap);
    }

    const updatedActivities = activities.map((activity) =>
      activity.id === selectedTask.id ? toCleanedObject(updatedTask) : activity
    );
    setActivities(updatedActivities);
  };

  const handleCancel = () => router.replace('/tasks');

  const togglePendingTaskOption = () => setIsCarriedOverRef.current?.(!isCarriedOver);

  const toggleTitleModal = () => setIsTitleModalOpen((prev) => !prev);

  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);

  const toggleNoteModal = () => setIsNoteModalOpen((prev) => !prev);

  const toggleRemindersModal = () => setIsRemindersModalOpen((prev) => !prev);

  const toggleChecklistModal = () => setIsChecklistModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleFrequencyModal = () => setIsFrequencyModalOpen((prev) => !prev);

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
      <RippleButton onPress={toggleTitleModal}>
        <OptionContainer>
          <OptionInfo>
            <PenSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Title</OptionTitle>
          </OptionInfo>
          <Text color="$customGray1">{toTruncatedText(title, 24)}</Text>
        </OptionContainer>
      </RippleButton>
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

      <ModalContainer isOpen={isTitleModalOpen} closeModal={toggleTitleModal}>
        <TextModalModule
          control={control}
          name="title"
          initialText={title}
          closeModal={toggleTitleModal}
        />
      </ModalContainer>
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

const OptionLabel = styled(View, {
  paddingHorizontal: 26,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: '$customRed5',
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 36,
  height: 36,
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
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ButtonText = styled(Text, {
  fontSize: 15,
  fontWeight: 'bold',
});

const AnimatedIconContainer = Animated.createAnimatedComponent(IconContainer);

export default EditTask;

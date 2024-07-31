import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { getTokenValue, styled, Text, View } from 'tamagui';

import { CURRENT_DATE } from '@/app/constants';
import { Activity, NewActivityData } from '@/app/entities';
import { useActivityStore } from '@/app/store';
import { toCleanedObject, toFormattedDateString, toTruncatedText } from '@/app/utils';
import { activitySchema } from '@/app/validationSchemas';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import BellSvg from '../../icons/BellSvg';
import BinSvg from '../../icons/BinSvg';
import CalendarEndSvg from '../../icons/CalendarEndSvg';
import CalendarStartSvg from '../../icons/CalendarStartSvg';
import FlagSvg from '../../icons/FlagSvg';
import LoopSvg from '../../icons/LoopSvg';
import PenSvg from '../../icons/PenSvg';
import PenToSquareSvg from '../../icons/PenToSquareSvg';
import SquareGridSvg from '../../icons/SquareGridSvg';
import CategoryIcon from '../CategoryIcon';
import CategoryModalModule from '../modals/CategoryModalModule';
import ModalContainer from '../modals/ModalContainer';
import PriorityModalModule from '../modals/PriorityModalModule';
import RemindersModalModule from '../modals/RemindersModalModule';
import TextModalModule from '../modals/TextModalModule';
import FrequencyBadge from './FrequencyBadge';
import FrequencyListModule from './FrequencyListModule';

interface Props {
  activities: Activity[];
  selectedHabit: Activity;
}

const SVG_SIZE = 22;

const EditHabit = ({ activities, selectedHabit }: Props) => {
  const setActivities = useActivityStore((s) => s.setActivities);

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);

  const setStartDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<NewActivityData>({
    defaultValues: {
      ...selectedHabit,
    },
    resolver: zodResolver(activitySchema),
  });

  const watchAllFields = watch();

  const { title, category, note, priority, frequency, startDate, endDate, reminders } =
    watchAllFields;

  const handleDelete = () => {
    const filteredActivities = activities.filter(
      (activity) => activity.id !== selectedHabit.id
    );
    setActivities(filteredActivities);
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

  const onSubmit: SubmitHandler<NewActivityData> = (data) => {
    const updatedHabit: Activity = {
      ...selectedHabit,
      ...data,
    };
    const updatedActivities = activities.map((activity) =>
      activity.id === selectedHabit.id ? toCleanedObject(updatedHabit) : activity
    );
    setActivities(updatedActivities);
  };

  const toggleTitleModal = () => setIsTitleModalOpen((prev) => !prev);

  const toggleCategoryModal = () => setIsCategoryModalOpen((prev) => !prev);

  const toggleNoteModal = () => setIsNoteModalOpen((prev) => !prev);

  const toggleRemindersModal = () => setIsRemindersModalOpen((prev) => !prev);

  const togglePriorityModal = () => setIsPriorityModalOpen((prev) => !prev);

  const toggleFrequencyModal = () => setIsFrequencyModalOpen((prev) => !prev);

  useEffect(() => {
    if (!isSubmitSuccessful) return;

    reset();
    router.replace('/habits');
  }, [isSubmitSuccessful]);

  const customBlack1 = getTokenValue('$customBlack1');
  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

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
        <CategoryContainer>
          <CategoryIcon category={category} fill={customBlack1} />
        </CategoryContainer>
      </OptionContainer>
      <OptionContainer onPress={toggleNoteModal}>
        <OptionInfo>
          <PenToSquareSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
          <OptionTitle>Notes</OptionTitle>
        </OptionInfo>
        {note && <Text color="$customGray1">{toTruncatedText(note, 16)}</Text>}
      </OptionContainer>
      <OptionContainer onPress={toggleRemindersModal}>
        <OptionInfo>
          <BellSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Time and reminders</OptionTitle>
        </OptionInfo>
        <OptionLabel>
          <LabelText>
            {!!reminders?.length
              ? reminders.length + (reminders.length === 1 ? ' reminder' : ' reminders')
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
          <LabelText>{priority}</LabelText>
        </OptionLabel>
      </OptionContainer>
      <OptionContainer onPress={toggleFrequencyModal}>
        <OptionInfo>
          <LoopSvg size={SVG_SIZE} fill={customRed1} />
          <OptionTitle>Frequency</OptionTitle>
        </OptionInfo>
        <FrequencyBadge frequency={frequency} isForm />
      </OptionContainer>
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
              <LabelRow>
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
                        toFormattedDateString(CURRENT_DATE)
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
          <BinSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
          <OptionTitle>Delete</OptionTitle>
        </OptionInfo>
      </OptionContainer>

      <ButtonsContainer>
        <Button onPress={() => router.replace('/habits')}>
          <ButtonText>CANCEL</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText color="$customRed1">CONFIRM</ButtonText>
        </Button>
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
      <ModalContainer isOpen={isNoteModalOpen} closeModal={toggleNoteModal}>
        <TextModalModule
          control={control}
          name="note"
          initialText={note}
          closeModal={toggleNoteModal}
        />
      </ModalContainer>
      <ModalContainer isOpen={isRemindersModalOpen} closeModal={toggleRemindersModal}>
        <RemindersModalModule
          control={control}
          reminders={reminders}
          closeModal={toggleRemindersModal}
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

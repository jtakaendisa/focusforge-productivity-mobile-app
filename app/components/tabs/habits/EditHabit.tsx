import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { styled, Text, View } from 'tamagui';

import { categoryColorMap } from '@/app/constants';
import { Activity, NewActivityData } from '@/app/entities';
import useActivityModals from '@/app/hooks/useActivityModals';
import useCompletionDates from '@/app/hooks/useCompletionDates';
import useCustomColors from '@/app/hooks/useCustomColors';
import useDatePicker from '@/app/hooks/useDatePicker';
import useFormHandler from '@/app/hooks/useFormHandler';
import { useActivityStore } from '@/app/store';
import { toCleanedObject, toFormattedDateString, toTruncatedText } from '@/app/utils';
import { activitySchema } from '@/app/validationSchemas';
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
import RippleButton from '../RippleButton';
import FrequencyBadge from './FrequencyBadge';
import FrequencyListModule from './FrequencyListModule';

interface Props {
  activities: Activity[];
  selectedHabit: Activity;
}

const SVG_SIZE = 22;

const EditHabit = ({ activities, selectedHabit }: Props) => {
  const setActivities = useActivityStore((s) => s.setActivities);

  const {
    isTitleModalOpen,
    isCategoryModalOpen,
    isFrequencyModalOpen,
    isNoteModalOpen,
    isPriorityModalOpen,
    isRemindersModalOpen,
    toggleTitleModal,
    toggleCategoryModal,
    toggleFrequencyModal,
    toggleNoteModal,
    togglePriorityModal,
    toggleRemindersModal,
  } = useActivityModals();

  const { customBlack1, customGray1, customRed1 } = useCustomColors();

  const setStartDateRef = useRef<((...event: any[]) => void) | null>(null);
  const setEndDateRef = useRef<((...event: any[]) => void) | null>(null);

  const { handleStartDateSelect, handleEndDateSelect, handleEndDateClear } =
    useDatePicker(setStartDateRef, setEndDateRef, true);

  const {
    completionDatesMap,
    generateCompletionDates,
    mergeCompletionDates,
    updateCompletionDatesMap,
  } = useCompletionDates();

  const navigateBack = () => router.replace('/habits');

  const onSubmit: SubmitHandler<NewActivityData> = async (data) => {
    const updatedHabit: Activity = {
      ...selectedHabit,
      ...data,
    };

    // Retrieve the current completion dates map from storage
    const currentCompletionDatesMap = { ...completionDatesMap };

    // Retrieve existing completion dates for the selected habit
    const existingCompletionDates = currentCompletionDatesMap[selectedHabit.id];

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
    currentCompletionDatesMap[selectedHabit.id] = mergedCompletionDates;

    // Store the updated map back to local storage
    await updateCompletionDatesMap(currentCompletionDatesMap);

    const updatedActivities = activities.map((activity) =>
      activity.id === selectedHabit.id ? toCleanedObject(updatedHabit) : activity
    );
    setActivities(updatedActivities);
    navigateBack();
  };

  const { control, watchAllFields, handleFormSubmit } = useFormHandler({
    schema: activitySchema,
    defaultValues: {
      ...selectedHabit,
    },
    onSubmit,
  });

  const { title, category, note, priority, frequency, startDate, endDate, reminders } =
    watchAllFields;

  const handleDelete = () => {
    const filteredActivities = activities.filter(
      (activity) => activity.id !== selectedHabit.id
    );
    setActivities(filteredActivities);
    navigateBack();
  };

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
          <CategoryContainer backgroundColor={categoryColorMap[category]}>
            <CategoryIcon category={category} fill={customBlack1} />
          </CategoryContainer>
        </OptionContainer>
      </RippleButton>
      <RippleButton onPress={toggleNoteModal}>
        <OptionContainer>
          <OptionInfo>
            <PenToSquareSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
            <OptionTitle>Notes</OptionTitle>
          </OptionInfo>
          {note && <Text color="$customGray1">{toTruncatedText(note, 16)}</Text>}
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
      <RippleButton onPress={toggleFrequencyModal}>
        <OptionContainer>
          <OptionInfo>
            <LoopSvg size={SVG_SIZE} fill={customRed1} />
            <OptionTitle>Frequency</OptionTitle>
          </OptionInfo>
          <FrequencyBadge frequency={frequency} isForm />
        </OptionContainer>
      </RippleButton>
      <RippleButton onPress={handleStartDateSelect}>
        <OptionContainer>
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
                      toFormattedDateString(new Date())
                        ? 'Today'
                        : toFormattedDateString(startDate))}
                  </LabelText>
                </OptionLabel>
              );
            }}
          />
        </OptionContainer>
      </RippleButton>
      <RippleButton onPress={handleEndDateSelect}>
        <OptionContainer>
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
                          toFormattedDateString(new Date())
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
      </RippleButton>
      <RippleButton onPress={handleDelete}>
        <OptionContainer>
          <OptionInfo>
            <BinSvg size={SVG_SIZE} fill={customRed1} variant="outline" />
            <OptionTitle>Delete</OptionTitle>
          </OptionInfo>
        </OptionContainer>
      </RippleButton>

      <ButtonsContainer>
        <RippleButton flex onPress={navigateBack}>
          <Button>
            <ButtonText>CANCEL</ButtonText>
          </Button>
        </RippleButton>
        <RippleButton flex onPress={handleFormSubmit}>
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

export default EditHabit;

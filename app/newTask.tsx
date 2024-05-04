import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { styled, Text, View } from 'tamagui';

import { PriorityType } from './store';
import { toFormattedDateString } from './utils';
import { taskSchema } from './validationSchemas';
import CategoryModal from './components/tabs/todo/modals/CategoryModal';
import ChecklistModal from './components/tabs/todo/modals/ChecklistModal';
import PriorityModal from './components/tabs/todo/modals/PriorityModal';
import NoteModal from './components/tabs/todo/modals/NoteModal';

export type NewTaskData = z.infer<typeof taskSchema>;

const TODAYS_DATE = toFormattedDateString(new Date());

const NewTaskScreen = () => {
  const [modalState, setModalState] = useState({
    categoryIsOpen: false,
    checklistIsOpen: false,
    priorityIsOpen: false,
    noteIsOpen: false,
  });

  const setDueDateRef = useRef<((...event: any[]) => void) | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<NewTaskData>({
    defaultValues: {
      task: '',
      category: 'Task',
      dueDate: TODAYS_DATE,
      priority: PriorityType.normal,
      checklist: [],
      note: '',
      isCarriedOver: true,
    },
    resolver: zodResolver(taskSchema),
  });

  const watchAllFields = watch();

  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDueDateRef.current?.(toFormattedDateString(selectedDate));
    }
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: handleDateSelect,
      is24Hour: true,
    });
  };

  const { categoryIsOpen, checklistIsOpen, priorityIsOpen, noteIsOpen } = modalState;

  const { category, dueDate, checklist, priority, note, isCarriedOver } =
    watchAllFields;

  return (
    <Container>
      <ScreenBadge>
        <Text>New Task</Text>
      </ScreenBadge>
      <Controller
        control={control}
        name="task"
        render={({ field: { onChange, onBlur, value } }) => (
          <TaskInputField
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoFocus
          />
        )}
      />
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Category</OptionHeading>
        </OptionInfo>
        <OptionValuePicker
          onPress={() => setModalState({ ...modalState, categoryIsOpen: true })}
        >
          <Text color="black">{category}</Text>
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Date</OptionHeading>
        </OptionInfo>
        <OptionValuePicker onPress={() => showMode()}>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange } }) => {
              setDueDateRef.current = onChange;
              return (
                <Text color="black">{dueDate === TODAYS_DATE ? 'Today' : dueDate}</Text>
              );
            }}
          />
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Checklist</OptionHeading>
        </OptionInfo>
        <OptionValuePicker
          onPress={() => setModalState({ ...modalState, checklistIsOpen: true })}
        >
          <Text color="black">
            {checklist.length} sub {checklist.length === 1 ? 'task' : 'tasks'}
          </Text>
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Priority</OptionHeading>
        </OptionInfo>
        <OptionValuePicker
          onPress={() => setModalState({ ...modalState, priorityIsOpen: true })}
        >
          <Text color="black">{priority}</Text>
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Note</OptionHeading>
        </OptionInfo>
        <OptionValuePicker
          onPress={() => setModalState({ ...modalState, noteIsOpen: true })}
        >
          <Text color="black">
            {note.length > 0
              ? note.substring(0, 8) + (note.length >= 8 ? '...' : '')
              : ''}
          </Text>
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <OptionContainer>
        <OptionInfo>
          <OptionIcon></OptionIcon>
          <OptionHeading>Pending Task</OptionHeading>
        </OptionInfo>
        <OptionValuePicker>
          <Controller
            control={control}
            name="isCarriedOver"
            render={({ field: { onChange } }) => (
              <BouncyCheckbox
                size={25}
                fillColor="red"
                unFillColor="#FFFFFF"
                iconStyle={{ borderColor: 'red' }}
                innerIconStyle={{ borderWidth: 2 }}
                isChecked={isCarriedOver}
                onPress={(isChecked) => onChange(isChecked)}
              />
            )}
          />
        </OptionValuePicker>
      </OptionContainer>
      <Separator />
      <ButtonsContainer>
        <Button onPress={() => router.replace('/(tabs)/todo')}>
          <Text color="gray">CANCEL</Text>
        </Button>
        <Button>
          <Text color="red">CONFIRM</Text>
        </Button>
      </ButtonsContainer>

      {categoryIsOpen && (
        <CategoryModal
          dismissKeyboard
          control={control}
          closeModal={() => setModalState({ ...modalState, categoryIsOpen: false })}
        />
      )}
      {checklistIsOpen && (
        <ChecklistModal
          control={control}
          closeModal={() => setModalState({ ...modalState, checklistIsOpen: false })}
        />
      )}
      {priorityIsOpen && (
        <PriorityModal
          dismissKeyboard
          currentPriority={priority}
          control={control}
          closeModal={() => setModalState({ ...modalState, priorityIsOpen: false })}
        />
      )}
      {noteIsOpen && (
        <NoteModal
          control={control}
          previousNote={note}
          closeModal={() => setModalState({ ...modalState, noteIsOpen: false })}
        />
      )}
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  paddingHorizontal: 8,
  gap: 16,
});

const ScreenBadge = styled(View, {
  alignSelf: 'flex-start',
  padding: 8,
  borderRadius: 4,
  backgroundColor: 'gray',
});

const TaskInputField = styled(TextInput, {
  borderWidth: 2,
  borderColor: 'gray',
  borderRadius: 8,
  paddingVertical: 6,
  paddingHorizontal: 16,
  //@ts-ignore
  fontSize: 16,
});

const OptionContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const OptionInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const OptionIcon = styled(View, {
  width: 32,
  height: 32,
  borderWidth: 1,
  borderColor: 'black',
});

const OptionHeading = styled(Text, {
  fontSize: 16,
  color: 'black',
});

const OptionValuePicker = styled(View, {
  padding: 10,
  borderWidth: 1,
  borderColor: 'red',
});

const Separator = styled(View, {
  height: 1,
  borderBottomWidth: 1,
  borderColor: '#ccc',
  width: '110%',
  marginLeft: '-5%',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingVertical: 20,
  borderTopWidth: 1,
  borderColor: '#ccc',
  backgroundColor: 'white',
});

const Button = styled(View, {
  width: '50%',
  justifyContent: 'center',
  alignItems: 'center',
});

export default NewTaskScreen;

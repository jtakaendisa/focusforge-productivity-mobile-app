import { useState } from 'react';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { Reminder } from '@/app/entities';
import { TODAYS_DATE } from '@/app/constants';
import { toFormattedTimeString } from '@/app/utils';
import ReminderButton from '../habits/ReminderButton';

interface Props {
  closeModal: () => void;
  onAdd: (reminder: Reminder) => void;
}

const NewReminderModalModule = ({ closeModal, onAdd }: Props) => {
  const [newReminder, setNewReminder] = useState<Reminder>({
    id: uuid.v4() as string,
    type: 'notification',
    time: TODAYS_DATE,
  });

  const { type, time } = newReminder;

  const handleSetReminderType = (type: 'notification' | 'alarm') => {
    setNewReminder({ ...newReminder, type });
  };

  const handleSetReminderTime = (
    event: DateTimePickerEvent,
    selectedDateTime: Date | undefined
  ) => {
    if (selectedDateTime) {
      setNewReminder({ ...newReminder, time: selectedDateTime });
    }
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      mode: 'time',
      value: new Date(),
      onChange: handleSetReminderTime,
      is24Hour: true,
    });
  };

  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>New reminder</HeadingText>
      </HeadingContainer>
      <MainContent>
        <TimePicker onPress={showTimePicker}>
          <TimeText>{toFormattedTimeString(time)}</TimeText>
          <Text color={customRed1}>Reminder time</Text>
        </TimePicker>
        <ReminderButtonsContainer>
          <Row>
            <ReminderButton
              isSelected={type === 'notification'}
              onSelect={() => handleSetReminderType('notification')}
              variant="notification"
            />
            <ReminderButton
              isSelected={type === 'alarm'}
              onSelect={() => handleSetReminderType('alarm')}
              variant="alarm"
            />
          </Row>
          <Text color={customRed1}>Reminder type</Text>
        </ReminderButtonsContainer>
      </MainContent>
      <ButtonsContainer>
        <Button onPress={closeModal}>
          <Text>CANCEL</Text>
        </Button>
        <Button
          onPress={() => {
            onAdd(newReminder);
            closeModal();
          }}
        >
          <ButtonText color={customRed1}>CONFIRM</ButtonText>
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled(View, {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '$customGray3',
});

const HeadingContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const HeadingText = styled(Text, {
  fontSize: 16,
});

const MainContent = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
});

const TimePicker = styled(View, {
  alignItems: 'center',
  width: '100%',
  paddingBottom: 12,
  marginBottom: 20,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const TimeText = styled(Text, {
  fontSize: 32,
  fontWeight: 'bold',
});

const ReminderButtonsContainer = styled(View, {
  alignItems: 'center',
  gap: 8,
});

const Row = styled(View, {
  flexDirection: 'row',
  borderRadius: 12,
  overflow: 'hidden',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  borderTopWidth: 1,
  borderColor: '$customGray2',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  paddingVertical: 16,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export default NewReminderModalModule;

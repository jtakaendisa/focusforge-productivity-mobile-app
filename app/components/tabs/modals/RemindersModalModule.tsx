import { useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import Svg, { Path } from 'react-native-svg';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styled, View, Text, Image } from 'tamagui';

import { Reminder } from '@/app/entities';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { NewHabitData } from '@/app/newHabit';
import ReminderListItem from '../../habits/ReminderListItem';
import ModalContainer from './ModalContainer';
import NewReminderModalModule from './NewReminderModalModule';

interface Props {
  control: Control<NewHabitData>;
  reminders: Reminder[];
  closeModal: () => void;
}

const RemindersModalModule = ({ control, reminders, closeModal }: Props) => {
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);

  const listRef = useRef<FlashList<Reminder> | null>(null);
  const setRemindersRef = useRef<((...event: any[]) => void) | null>(null);

  const handleCreateReminder = (newReminder: Reminder) => {
    const updatedReminders = [...reminders, newReminder];
    setRemindersRef.current?.(updatedReminders);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const handleDeleteReminder = (reminderId: string) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== reminderId);
    setRemindersRef.current?.(updatedReminders);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const toggleNewReminderModal = () => setIsNewReminderOpen((prev) => !prev);

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Time and reminders</HeadingText>
      </HeadingContainer>
      <Controller
        control={control}
        name="reminders"
        render={({ field: { onChange } }) => {
          setRemindersRef.current = onChange;

          return (
            <MainContent>
              {!reminders.length ? (
                <AnimatedPlaceholderContainer entering={FadeIn} exiting={FadeOut}>
                  <Image
                    source={{
                      uri: require('@/assets/images/bell.png'),
                      width: 120,
                      height: 120,
                    }}
                  />
                  <PlaceholderText>No reminders for this activity</PlaceholderText>
                </AnimatedPlaceholderContainer>
              ) : (
                <AnimatedFlashList
                  ref={listRef}
                  data={reminders}
                  renderItem={({ item }) => (
                    <ReminderListItem listItem={item} onDelete={handleDeleteReminder} />
                  )}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={46}
                  estimatedListSize={{
                    width: SCREEN_WIDTH * 0.8,
                    height: SCREEN_HEIGHT / 3,
                  }}
                />
              )}
            </MainContent>
          );
        }}
      />
      <Button onPress={toggleNewReminderModal}>
        <ButtonTextRow>
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path
              d="M10 1.875C12.1549 1.875 14.2215 2.73102 15.7452 4.25476C17.269 5.77849 18.125 7.84512 18.125 10C18.125 12.1549 17.269 14.2215 15.7452 15.7452C14.2215 17.269 12.1549 18.125 10 18.125C7.84512 18.125 5.77849 17.269 4.25476 15.7452C2.73102 14.2215 1.875 12.1549 1.875 10C1.875 7.84512 2.73102 5.77849 4.25476 4.25476C5.77849 2.73102 7.84512 1.875 10 1.875ZM10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM9.0625 14.375H10.9375V13.4375V10.9375H13.4375H14.375V9.0625H13.4375H10.9375V6.5625V5.625H9.0625V6.5625V9.0625H6.5625H5.625V10.9375H6.5625H9.0625V13.4375V14.375Z"
              fill="#C73A57"
            />
          </Svg>
          <ButtonText color="#C73A57">NEW REMINDER</ButtonText>
        </ButtonTextRow>
      </Button>
      <Button onPress={closeModal}>
        <ButtonText>CLOSE</ButtonText>
      </Button>

      <ModalContainer isOpen={isNewReminderOpen} closeModal={toggleNewReminderModal}>
        <NewReminderModalModule
          closeModal={toggleNewReminderModal}
          onAdd={handleCreateReminder}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '#1C1C1C',
});

const HeadingContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const HeadingText = styled(Text, {
  fontSize: 16,
});

const MainContent = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  height: SCREEN_HEIGHT / 3,
});

const PlaceholderContainer = styled(View, {
  alignItems: 'center',
  gap: 8,
});

const PlaceholderText = styled(Text, {
  fontSize: 12,
  color: '#8C8C8C',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderTopWidth: 1,
  borderColor: '#262626',
});

const ButtonTextRow = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
});

const ButtonText = styled(Text, {
  fontSize: 15.5,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const AnimatedPlaceholderContainer =
  Animated.createAnimatedComponent(PlaceholderContainer);

export default RemindersModalModule;

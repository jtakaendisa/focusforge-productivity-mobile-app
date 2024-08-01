import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { getTokenValue, Image, styled, Text, View } from 'tamagui';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';
import { NewActivityData, Reminder } from '@/app/entities';
import PlusCircleSvg from '../../icons/PlusCircleSvg';
import ReminderListItem from '../habits/ReminderListItem';
import ModalContainer from './ModalContainer';
import NewReminderModalModule from './NewReminderModalModule';
import RippleButton from '../RippleButton';

interface Props {
  control: Control<NewActivityData>;
  reminders?: Reminder[];
  closeModal: () => void;
}

const RemindersModalModule = ({ control, reminders, closeModal }: Props) => {
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);

  const listRef = useRef<FlashList<Reminder> | null>(null);
  const setRemindersRef = useRef<((...event: any[]) => void) | null>(null);

  const handleReminderAdd = (newReminder: Reminder) => {
    const updatedReminders = reminders ? [...reminders, newReminder] : [newReminder];
    setRemindersRef.current?.(updatedReminders);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const handleReminderRemove = (reminderId: string) => {
    const updatedReminders = reminders?.filter(
      (reminder) => reminder.id !== reminderId
    );
    setRemindersRef.current?.(updatedReminders);
    listRef.current?.prepareForLayoutAnimationRender();
  };

  const toggleNewReminderModal = () => setIsNewReminderOpen((prev) => !prev);

  const customRed1 = getTokenValue('$customRed1');

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
              {!reminders?.length ? (
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
                    <ReminderListItem listItem={item} onDelete={handleReminderRemove} />
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
      <RippleButton onPress={toggleNewReminderModal}>
        <Button>
          <ButtonTextRow>
            <PlusCircleSvg fill={customRed1} />
            <ButtonText color={customRed1}>NEW REMINDER</ButtonText>
          </ButtonTextRow>
        </Button>
      </RippleButton>
      <RippleButton onPress={closeModal}>
        <Button>
          <ButtonText>CLOSE</ButtonText>
        </Button>
      </RippleButton>

      <ModalContainer isOpen={isNewReminderOpen} closeModal={toggleNewReminderModal}>
        <NewReminderModalModule
          closeModal={toggleNewReminderModal}
          onAdd={handleReminderAdd}
        />
      </ModalContainer>
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
  height: SCREEN_HEIGHT / 3,
});

const PlaceholderContainer = styled(View, {
  alignItems: 'center',
  gap: 8,
});

const PlaceholderText = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 16,
  borderTopWidth: 1,
  borderColor: '$customGray2',
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

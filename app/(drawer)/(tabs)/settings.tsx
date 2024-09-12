import { useState } from 'react';
import { Image, styled, Text, View } from 'tamagui';

import ArrowRightFromBracketSvg from '@/app/components/icons/ArrowRightFromBracketSvg';
import BellSvg from '@/app/components/icons/BellSvg';
import MoonStarsSvg from '@/app/components/icons/MoonStarsSvg';
import PenToSquareSvg from '@/app/components/icons/PenToSquareSvg';
import RippleButton from '@/app/components/tabs/RippleButton';
import { useAuth } from '@/app/hooks/useAuth';
import useCustomColors from '@/app/hooks/useCustomColors';
import { useImagePicker } from '@/app/hooks/useImagePicker';
import EditPhotoModalModule from '../../components/tabs/modals/EditPhotoModalModule';
import ModalContainer from '../../components/tabs/modals/ModalContainer';
import Switch from '../../components/tabs/settings/Switch';
import { SCREEN_HEIGHT } from '../../constants';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const { authUser, signOut } = useAuth();
  const {
    photoUri,
    isModalOpen,
    toggleModal,
    handleCameraPress,
    handleGalleryPress,
    removeImage,
  } = useImagePicker();

  const { customRed1 } = useCustomColors();

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const togglePushNotifications = () => setPushNotifications((prev) => !prev);

  return (
    <Container>
      <ProfileContainer>
        <ProfilePhotoContainer>
          <Image
            source={{
              uri: photoUri.length ? photoUri : require('@/assets/images/avatar.jpg'),
              width: 100,
              height: 100,
            }}
            width="102%"
            height="102%"
          />
        </ProfilePhotoContainer>
        <InfoContainer>
          <Username>{authUser?.username || authUser?.displayName || 'User'}</Username>
          <Email>{authUser?.email}</Email>
        </InfoContainer>
        <ButtonsContainer>
          <RippleButton onPress={toggleModal}>
            <Button>
              <PenToSquareSvg size={16} fill={customRed1} variant="outline" />
              <ButtonText>Edit Photo</ButtonText>
            </Button>
          </RippleButton>
          <RippleButton onPress={signOut}>
            <Button>
              <ArrowRightFromBracketSvg size={16} fill={customRed1} />
              <ButtonText>Sign Out</ButtonText>
            </Button>
          </RippleButton>
        </ButtonsContainer>
      </ProfileContainer>
      <Separator />
      <ApplicationSettingsContainer>
        <Heading>Application</Heading>
        <SettingCard>
          <SettingInfo>
            <MoonStarsSvg size={24} fill={customRed1} />
            <SettingTitle>Dark Mode</SettingTitle>
          </SettingInfo>
          <Switch value={darkMode ? 1 : 0} onToggle={toggleDarkMode} />
        </SettingCard>
        <SettingCard>
          <SettingInfo>
            <BellSvg size={24} fill={customRed1} />
            <SettingTitle>Push Notifications</SettingTitle>
          </SettingInfo>
          <Switch
            value={pushNotifications ? 1 : 0}
            onToggle={togglePushNotifications}
          />
        </SettingCard>
      </ApplicationSettingsContainer>

      <ModalContainer isOpen={isModalOpen} closeModal={toggleModal}>
        <EditPhotoModalModule
          onCameraPress={handleCameraPress}
          onGalleryPress={handleGalleryPress}
          onRemovePress={removeImage}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

const ProfileContainer = styled(View, {
  position: 'relative',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: SCREEN_HEIGHT / 10,
  marginHorizontal: 12,
  paddingTop: 42,
  paddingBottom: 16,
  borderRadius: 12,
  backgroundColor: '$customGray3',
});

const ProfilePhotoContainer = styled(View, {
  position: 'absolute',
  top: -50,
  justifyContent: 'center',
  alignItems: 'center',
  width: 100,
  height: 100,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: 'white',
  overflow: 'hidden',
});

const InfoContainer = styled(View, {
  alignItems: 'center',
  gap: 9,
  marginVertical: 20,
});

const Username = styled(Text, {
  fontSize: 22,
});

const Email = styled(Text, {
  fontSize: 14,
  color: '$customGray1',
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
});

const Button = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingVertical: 4,
  paddingHorizontal: 6,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '$customGray1',
});

const ButtonText = styled(Text, {
  fontSize: 13,
  color: '$customGray1',
});

const Separator = styled(View, {
  height: 1,
  marginVertical: 30,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const ApplicationSettingsContainer = styled(View, {
  marginHorizontal: 12,
});

const Heading = styled(Text, {
  fontSize: 18,
  marginBottom: 20,
});

const SettingCard = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
  marginBottom: 14,
  backgroundColor: '$customGray3',
  borderRadius: 12,
});

const SettingInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const SettingTitle = styled(Text, {
  fontSize: 16,
});

export default SettingsScreen;

import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';
import { styled, View, Text, Image } from 'tamagui';

import { useAuthStore } from '../store';
import { SCREEN_HEIGHT } from '../constants';
import { signOutAuthUser } from '../services/auth';
import Switch from '../components/tabs/settings/Switch';
import ModalContainer from '../components/tabs/modals/ModalContainer';
import EditPhotoModalModule from '../components/tabs/modals/EditPhotoModalModule';

const SettingsScreen = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState('');

  const handleSignOut = async () => {
    try {
      await signOutAuthUser();
      setAuthUser(null);
      router.replace('/(auth)');
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const saveImage = async (photoUri: string) => {
    try {
      setPhotoUri(photoUri);
    } catch (error) {
      throw error;
    }
  };

  const removeImage = () => {
    saveImage('');
    setIsModalOpen(false);
  };

  const uploadImage = async (mode: 'camera' | 'gallery') => {
    try {
      let result: ImagePicker.ImagePickerResult | null = null;

      if (mode === 'camera') {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (mode === 'gallery') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (result && !result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      setIsModalOpen(false);
    }
  };

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
          <Button onPress={() => setIsModalOpen(true)}>
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path
                d="M10.7354 0.978845L11.0212 1.26459C11.3163 1.55978 11.3163 2.03916 11.0212 2.33435L10.3906 2.96487L9.03513 1.60937L9.66565 0.978845C9.96084 0.683656 10.4402 0.683656 10.7354 0.978845ZM4.46325 6.18125L8.50143 2.14307L9.85693 3.49857L5.81875 7.53675C5.71957 7.63593 5.59205 7.70678 5.45508 7.73984L3.90593 8.09643L4.26252 6.54492C4.29322 6.40795 4.36407 6.28043 4.46561 6.18125H4.46325ZM9.13195 0.442783L3.92955 5.64755C3.72882 5.84827 3.58949 6.10095 3.52573 6.37725L3.03218 8.51678C3.00384 8.6443 3.04162 8.77654 3.13372 8.86864C3.22582 8.96074 3.35806 8.99852 3.48559 8.97019L5.62511 8.47663C5.90141 8.41287 6.15409 8.27354 6.35482 8.07281L11.5572 2.86805C12.1476 2.27767 12.1476 1.32126 11.5572 0.730887L11.2715 0.442783C10.6811 -0.147594 9.72469 -0.147594 9.13431 0.442783H9.13195ZM1.88921 1.42045C0.84542 1.42045 0 2.26587 0 3.30965V10.1108C0 11.1546 0.84542 12 1.88921 12H8.69035C9.73413 12 10.5796 11.1546 10.5796 10.1108V7.08806C10.5796 6.88025 10.4095 6.71022 10.2017 6.71022C9.9939 6.71022 9.82387 6.88025 9.82387 7.08806V10.1108C9.82387 10.7366 9.31615 11.2443 8.69035 11.2443H1.88921C1.26341 11.2443 0.755682 10.7366 0.755682 10.1108V3.30965C0.755682 2.68385 1.26341 2.17613 1.88921 2.17613H4.91194C5.11975 2.17613 5.28978 2.0061 5.28978 1.79829C5.28978 1.59048 5.11975 1.42045 4.91194 1.42045H1.88921Z"
                fill="#C73A57"
              />
            </Svg>
            <ButtonText>Edit Photo</ButtonText>
          </Button>
          <Button onPress={handleSignOut}>
            <Svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <Path
                d="M12.8357 5.95179C12.8491 5.96518 12.8571 5.98125 12.8571 6C12.8571 6.01875 12.8491 6.0375 12.8357 6.04821L9.30268 9.38036C9.27054 9.4125 9.225 9.42857 9.17946 9.42857C9.08036 9.42857 9 9.34821 9 9.24911V7.71429C9 7.47857 8.80714 7.28571 8.57143 7.28571H5.35714C5.23929 7.28571 5.14286 7.18929 5.14286 7.07143V4.92857C5.14286 4.81071 5.23929 4.71429 5.35714 4.71429H8.57143C8.80714 4.71429 9 4.52143 9 4.28571V2.75089C9 2.65179 9.08036 2.57143 9.17946 2.57143C9.225 2.57143 9.26786 2.59018 9.30268 2.61964L12.8357 5.95179ZM13.7143 6C13.7143 5.74554 13.6098 5.50179 13.425 5.32768L9.88929 1.99554C9.69643 1.81607 9.44196 1.71429 9.17946 1.71429C8.60625 1.71429 8.14286 2.17768 8.14286 2.75089V3.85714H5.35714C4.76518 3.85714 4.28571 4.33661 4.28571 4.92857V7.07143C4.28571 7.66339 4.76518 8.14286 5.35714 8.14286H8.14286V9.24911C8.14286 9.82232 8.60625 10.2857 9.17946 10.2857C9.44464 10.2857 9.69911 10.1839 9.88929 10.0045L13.425 6.67232C13.6098 6.49821 13.7143 6.25446 13.7143 6ZM4.71429 0.857143C4.95 0.857143 5.14286 0.664286 5.14286 0.428571C5.14286 0.192857 4.95 0 4.71429 0H2.14286C0.958929 0 0 0.958929 0 2.14286V9.85714C0 11.0411 0.958929 12 2.14286 12H4.71429C4.95 12 5.14286 11.8071 5.14286 11.5714C5.14286 11.3357 4.95 11.1429 4.71429 11.1429H2.14286C1.43304 11.1429 0.857143 10.567 0.857143 9.85714V2.14286C0.857143 1.43304 1.43304 0.857143 2.14286 0.857143H4.71429Z"
                fill="#C73A57"
              />
            </Svg>
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </ButtonsContainer>
      </ProfileContainer>
      <Separator />
      <ApplicationSettingsContainer>
        <Heading>Application</Heading>
        <SettingCard>
          <SettingInfo>
            <Svg width="23" height="22" viewBox="0 0 23 22" fill="none">
              <Path
                d="M14.1935 2.12903L16.3226 2.83871L14.1935 3.54839L13.4839 5.67742L12.7742 3.54839L10.6452 2.83871L12.7742 2.12903L13.4839 0L14.1935 2.12903ZM19.5161 8.16129L22.7097 9.22581L19.5161 10.2903L18.4516 13.4839L17.3871 10.2903L14.1935 9.22581L17.3871 8.16129L18.4516 4.96774L19.5161 8.16129ZM8.51613 4.96774C9.44758 4.96774 10.3435 5.11855 11.1863 5.39355C10.2327 5.76169 9.38992 6.35161 8.72016 7.10121C7.70887 8.22782 7.09677 9.72258 7.09677 11.3548C7.09677 14.8145 9.84677 17.631 13.2798 17.7375C13.3464 17.7375 13.4173 17.7419 13.4839 17.7419C14.4597 17.7419 15.3867 17.5246 16.2161 17.1298C15.7238 18.1677 15.0274 19.0859 14.1847 19.8399C12.6766 21.1839 10.6895 22 8.51613 22C3.81452 22 0 18.1855 0 13.4839C0 9.0129 3.44194 5.34919 7.81976 4.99435C8.0504 4.97661 8.28105 4.96774 8.51613 4.96774ZM2.12903 13.4839C2.12903 17.0101 4.98992 19.871 8.51613 19.871C9.32782 19.871 10.104 19.7202 10.8137 19.4452C7.42056 18.323 4.96774 15.125 4.96774 11.3548C4.96774 10.0508 5.26048 8.81331 5.78387 7.70887C3.62379 8.73347 2.12903 10.9335 2.12903 13.4839Z"
                fill="#C73A57"
              />
            </Svg>
            <SettingTitle>Dark Mode</SettingTitle>
          </SettingInfo>
          <Switch
            value={darkMode ? 1 : 0}
            onToggle={() => setDarkMode((prev) => !prev)}
          />
        </SettingCard>
        <SettingCard>
          <SettingInfo>
            <Svg width="23" height="22" viewBox="0 0 23 22" fill="none">
              <Path
                d="M14.1935 2.12903L16.3226 2.83871L14.1935 3.54839L13.4839 5.67742L12.7742 3.54839L10.6452 2.83871L12.7742 2.12903L13.4839 0L14.1935 2.12903ZM19.5161 8.16129L22.7097 9.22581L19.5161 10.2903L18.4516 13.4839L17.3871 10.2903L14.1935 9.22581L17.3871 8.16129L18.4516 4.96774L19.5161 8.16129ZM8.51613 4.96774C9.44758 4.96774 10.3435 5.11855 11.1863 5.39355C10.2327 5.76169 9.38992 6.35161 8.72016 7.10121C7.70887 8.22782 7.09677 9.72258 7.09677 11.3548C7.09677 14.8145 9.84677 17.631 13.2798 17.7375C13.3464 17.7375 13.4173 17.7419 13.4839 17.7419C14.4597 17.7419 15.3867 17.5246 16.2161 17.1298C15.7238 18.1677 15.0274 19.0859 14.1847 19.8399C12.6766 21.1839 10.6895 22 8.51613 22C3.81452 22 0 18.1855 0 13.4839C0 9.0129 3.44194 5.34919 7.81976 4.99435C8.0504 4.97661 8.28105 4.96774 8.51613 4.96774ZM2.12903 13.4839C2.12903 17.0101 4.98992 19.871 8.51613 19.871C9.32782 19.871 10.104 19.7202 10.8137 19.4452C7.42056 18.323 4.96774 15.125 4.96774 11.3548C4.96774 10.0508 5.26048 8.81331 5.78387 7.70887C3.62379 8.73347 2.12903 10.9335 2.12903 13.4839Z"
                fill="#C73A57"
              />
            </Svg>
            <SettingTitle>Push Notifications</SettingTitle>
          </SettingInfo>
          <Switch
            value={pushNotifications ? 1 : 0}
            onToggle={() => setPushNotifications((prev) => !prev)}
          />
        </SettingCard>
      </ApplicationSettingsContainer>

      <ModalContainer isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <EditPhotoModalModule
          onCameraPress={() => uploadImage('camera')}
          onGalleryPress={() => uploadImage('gallery')}
          onRemovePress={removeImage}
        />
      </ModalContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '#111111',
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
  backgroundColor: '#1C1C1C',
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
  borderColor: '#fff',
  overflow: 'hidden',
});

const InfoContainer = styled(View, {
  alignItems: 'center',
  gap: 9,
  marginVertical: 20,
});

const Username = styled(Text, {
  fontSize: 18,
});

const Email = styled(Text, {
  fontSize: 12,
  color: '#8C8C8C',
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
  borderColor: '#8C8C8C',
});

const ButtonText = styled(Text, {
  fontSize: 12,
  color: '#8C8C8C',
});

const Separator = styled(View, {
  height: 1,
  marginVertical: 30,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const ApplicationSettingsContainer = styled(View, {
  marginHorizontal: 12,
});

const Heading = styled(Text, {
  fontSize: 16,
  marginBottom: 20,
});

const SettingCard = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
  marginBottom: 14,
  backgroundColor: '#1C1C1C',
  borderRadius: 12,
});

const SettingInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const SettingTitle = styled(Text, {
  fontSize: 14,
});

export default SettingsScreen;

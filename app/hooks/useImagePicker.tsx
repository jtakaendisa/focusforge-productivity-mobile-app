import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const [photoUri, setPhotoUri] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const removeImage = () => {
    setPhotoUri('');
    toggleModal();
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
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      toggleModal();
    }
  };

  const handleCameraPress = () => uploadImage('camera');

  const handleGalleryPress = () => uploadImage('gallery');

  return {
    photoUri,
    isModalOpen,
    toggleModal,
    handleCameraPress,
    handleGalleryPress,
    removeImage,
  };
};

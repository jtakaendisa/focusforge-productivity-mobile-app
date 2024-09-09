import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useOnboardingStatus = () => {
  const [fetchedStatus, setFetchedStatus] = useState(false);
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarded');

        if (value !== null) {
          setOnboarded(JSON.parse(value));
        } else {
          setOnboarded(false);
        }
      } catch (e) {
        console.log('error', e);
      } finally {
        setFetchedStatus(true);
      }
    };

    getData();
  }, []);

  return {
    fetchedStatus,
    onboarded,
  };
};

export default useOnboardingStatus;

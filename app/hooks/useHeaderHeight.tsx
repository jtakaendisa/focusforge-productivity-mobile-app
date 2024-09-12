import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const defaultHeaderHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const height = defaultHeaderHeight - statusBarHeight;

  useEffect(() => {
    if (height) {
      setHeaderHeight(height);
    }
  }, [height]);

  return {
    defaultHeaderHeight,
    statusBarHeight,
    headerHeight,
  };
};

export default useHeaderHeight;

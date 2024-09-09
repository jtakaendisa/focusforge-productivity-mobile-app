import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

const useContainerHeight = () => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  return { containerHeight, handleLayout };
};

export default useContainerHeight;

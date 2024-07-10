import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { getTokenValue } from 'tamagui';

interface Props {
  children: ReactNode;
  rippleColor?: string;
  noFade?: boolean;
  flex?: boolean;
  onPress: () => void;
}

const RippleButton = ({ children, rippleColor, noFade, flex, onPress }: Props) => {
  const customGray2 = getTokenValue('$customGray2');

  return (
    <Pressable
      style={{ flex: flex ? 1 : 0 }}
      onPress={onPress}
      android_ripple={{
        color: rippleColor || customGray2,
        borderless: false,
      }}
    >
      {({ pressed }) => (
        <View style={{ opacity: pressed && !noFade ? 0.5 : 1 }}>{children}</View>
      )}
    </Pressable>
  );
};

export default RippleButton;

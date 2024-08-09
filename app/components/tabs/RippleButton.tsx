import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { getTokenValue } from 'tamagui';

interface Props {
  children: ReactNode;
  rippleColor?: string;
  fade?: boolean;
  flex?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const RippleButton = ({
  children,
  rippleColor,
  fade,
  flex,
  disabled,
  onPress,
}: Props) => {
  const customGray2 = getTokenValue('$customGray2');

  return (
    <Pressable
      style={{ flex: flex ? 1 : 0 }}
      onPress={onPress}
      android_ripple={{
        color: rippleColor || customGray2,
        borderless: false,
      }}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View
          style={{
            opacity: pressed && fade ? 0.5 : 1,
          }}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
};

export default RippleButton;

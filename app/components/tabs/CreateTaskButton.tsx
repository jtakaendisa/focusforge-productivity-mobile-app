import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { View, styled } from 'tamagui';

interface Props {
  onPress: () => void;
}

const CreateTaskButton = ({ onPress }: Props) => {
  return (
    <Container onPress={onPress}>
      <Gradient colors={['#C33756', '#962C42']}>
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <Path
            d="M8.91823 0.923077C8.91823 0.411538 8.50692 0 7.99565 0C7.48439 0 7.07308 0.411538 7.07308 0.923077V7.07692H0.922576C0.411315 7.07692 0 7.48846 0 8C0 8.51154 0.411315 8.92308 0.922576 8.92308H7.07308V15.0769C7.07308 15.5885 7.48439 16 7.99565 16C8.50692 16 8.91823 15.5885 8.91823 15.0769V8.92308H15.0687C15.58 8.92308 15.9913 8.51154 15.9913 8C15.9913 7.48846 15.58 7.07692 15.0687 7.07692H8.91823V0.923077Z"
            fill="#fff"
          />
        </Svg>
      </Gradient>
    </Container>
  );
};

const Container = styled(View, {
  position: 'absolute',
  bottom: 18,
  right: 12,
  width: 56,
  height: 56,
  borderRadius: 16,
  overflow: 'hidden',
});

const Gradient = styled(LinearGradient, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

export default CreateTaskButton;

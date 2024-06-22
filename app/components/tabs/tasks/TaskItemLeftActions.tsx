import { StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AnimatedInterpolation } from '@/app/entities';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
  isCheckable?: boolean;
}

const SVG_SIZE = 20;

const TaskItemLeftActions = ({ dragAnimatedValue, isCheckable }: Props) => {
  const dragAnimation = {
    transform: [
      {
        translateX: dragAnimatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [-50, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.icon, dragAnimation]}>
      {isCheckable ? (
        <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 22" fill="none">
          <Path
            d="M2.75 1.375C2.75 0.614453 2.13555 0 1.375 0C0.614453 0 0 0.614453 0 1.375V2.75V15.8125V20.625C0 21.3855 0.614453 22 1.375 22C2.13555 22 2.75 21.3855 2.75 20.625V15.125L5.51289 14.4332C7.27891 13.9906 9.14805 14.1969 10.7766 15.009C12.6758 15.9586 14.8801 16.0746 16.8652 15.327L18.3563 14.7684C18.8934 14.5664 19.25 14.0551 19.25 13.4793V2.84023C19.25 1.85195 18.2102 1.20742 17.325 1.65L16.9125 1.85625C14.923 2.85313 12.5812 2.85313 10.5918 1.85625C9.08359 1.1 7.35195 0.910938 5.71484 1.31914L2.75 2.0625V1.375Z"
            fill="white"
          />
        </Svg>
      ) : (
        <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
          <Path
            d="M20.475 0.713109C19.5242 -0.237703 17.9873 -0.237703 17.0365 0.713109L15.7296 2.01559L19.9801 6.26602L21.2869 4.9592C22.2377 4.00839 22.2377 2.47146 21.2869 1.52065L20.475 0.713109ZM7.48493 10.2646C7.22009 10.5295 7.01603 10.8551 6.89881 11.2155L5.6137 15.0708C5.48779 15.4442 5.58765 15.8566 5.86551 16.1388C6.14337 16.421 6.55582 16.5166 6.93354 16.3906L10.7889 15.1055C11.1449 14.9883 11.4705 14.7843 11.7397 14.5194L19.0032 7.25157L14.7484 2.99679L7.48493 10.2646ZM4.16794 2.54961C1.86689 2.54961 0 4.4165 0 6.71755V17.8321C0 20.1331 1.86689 22 4.16794 22H15.2825C17.5835 22 19.4504 20.1331 19.4504 17.8321V13.6641C19.4504 12.8957 18.8295 12.2748 18.0611 12.2748C17.2926 12.2748 16.6718 12.8957 16.6718 13.6641V17.8321C16.6718 18.6005 16.0509 19.2214 15.2825 19.2214H4.16794C3.39948 19.2214 2.77863 18.6005 2.77863 17.8321V6.71755C2.77863 5.94908 3.39948 5.32824 4.16794 5.32824H8.33588C9.10435 5.32824 9.7252 4.70739 9.7252 3.93892C9.7252 3.17046 9.10435 2.54961 8.33588 2.54961H4.16794Z"
            fill="white"
          />
        </Svg>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#C33756',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default TaskItemLeftActions;

import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@/app/entities';

const ArrowRightSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 24" fill="none">
      <Path
        d="M12.9483 11.0517C13.4706 11.5739 13.4706 12.4184 12.9483 12.9352L2.28075 23.6083C1.75849 24.1306 0.913968 24.1306 0.397257 23.6083C-0.119455 23.086 -0.125011 22.2415 0.397257 21.7248L10.1203 12.0017L0.391701 2.27312C-0.130567 1.75085 -0.130567 0.906331 0.391701 0.38962C0.913968 -0.127092 1.75849 -0.132648 2.2752 0.38962L12.9483 11.0517Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ArrowRightSvg;

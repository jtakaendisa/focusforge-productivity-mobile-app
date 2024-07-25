import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const LoopSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M0 9.625V4.125V2.75H1.375H13.75V0H15.125L19.25 4.125L15.125 8.25H13.75V5.5H2.75V9.625V11H0V9.625ZM22 12.375V17.875V19.25H20.625H8.25V22H6.875L2.75 17.875L6.875 13.75H8.25V16.5H19.25V12.375V11H22V12.375Z"
        fill={fill}
      />
    </Svg>
  );
};

export default LoopSvg;

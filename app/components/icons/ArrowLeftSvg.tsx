import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@/app/entities';

const ArrowLeftSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 25" fill="none">
      <Path
        d="M1.15127 13.911C0.628998 13.3887 0.628998 12.5442 1.15127 12.0275L11.8189 1.35435C12.3411 0.83208 13.1856 0.83208 13.7024 1.35435C14.2191 1.87662 14.2246 2.72113 13.7024 3.23784L3.97929 12.9609L13.7079 22.6895C14.2302 23.2118 14.2302 24.0563 13.7079 24.573C13.1856 25.0897 12.3411 25.0953 11.8244 24.573L1.15127 13.911Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ArrowLeftSvg;

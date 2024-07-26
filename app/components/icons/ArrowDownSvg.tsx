import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const ArrowDownSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 11" fill="none">
      <Path
        d="M9.35777 10.6422C9.71014 10.9946 10.2899 10.9946 10.6422 10.6422L19.7357 1.54874C20.0881 1.19636 20.0881 0.616652 19.7357 0.26428C19.3833 -0.0880932 18.8036 -0.0880932 18.4513 0.26428L10 8.71554L1.54874 0.26428C1.19636 -0.0880932 0.616652 -0.0880932 0.26428 0.26428C-0.0880932 0.616652 -0.0880932 1.19636 0.26428 1.54874L9.35777 10.6422Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ArrowDownSvg;

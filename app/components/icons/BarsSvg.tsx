import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const BarsSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 20" fill="none">
      <Path
        d="M0 0H25.4811V1.81818H0V0ZM0 9.09091H25.4811V10.9091H0V9.09091ZM17.4121 18.1818V20H0V18.1818H17.4121Z"
        fill={fill}
      />
    </Svg>
  );
};

export default BarsSvg;

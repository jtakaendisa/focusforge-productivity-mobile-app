import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const PlusSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M11.1538 1.15385C11.1538 0.514423 10.6394 0 10 0C9.36058 0 8.84615 0.514423 8.84615 1.15385V8.84615H1.15385C0.514423 8.84615 0 9.36058 0 10C0 10.6394 0.514423 11.1538 1.15385 11.1538H8.84615V18.8462C8.84615 19.4856 9.36058 20 10 20C10.6394 20 11.1538 19.4856 11.1538 18.8462V11.1538H18.8462C19.4856 11.1538 20 10.6394 20 10C20 9.36058 19.4856 8.84615 18.8462 8.84615H11.1538V1.15385Z"
        fill={fill}
      />
    </Svg>
  );
};

export default PlusSvg;

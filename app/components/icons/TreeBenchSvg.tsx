import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const TreeBenchSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 640 512" fill="none">
      <Path
        d="M608 96C608 101.1 607.6 106.2 606.8 111.1C626.9 125.7 640 149.3 640 176V256H544V480V512H480V480V256H384V176C384 149.3 397.1 125.7 417.2 111.1C416.4 106.2 416 101.1 416 96C416 43 459 0 512 0C565 0 608 43 608 96ZM32 192H352V320H32V192ZM32 352H96H288H352H384V416H352V480V512H288V480V416H96V480V512H32V480V416H0V352H32Z"
        fill={fill}
      />
    </Svg>
  );
};

export default TreeBenchSvg;

import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const RandomBlocksSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 576 448" fill="none">
      <Path
        d="M0 48C0 21.5 21.5 0 48 0H272C298.5 0 320 21.5 320 48V176C320 202.5 298.5 224 272 224H48C21.5 224 0 202.5 0 176V48ZM384 48C384 21.5 405.5 0 432 0H528C554.5 0 576 21.5 576 48V304C576 330.5 554.5 352 528 352H432C405.5 352 384 330.5 384 304V48ZM112 272H288C314.5 272 336 293.5 336 320V400C336 426.5 314.5 448 288 448H112C85.5 448 64 426.5 64 400V320C64 293.5 85.5 272 112 272Z"
        fill={fill}
      />
    </Svg>
  );
};

export default RandomBlocksSvg;

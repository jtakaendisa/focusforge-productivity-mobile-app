import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const ArrowUpSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 43 24" fill="none">
      <Path
        d="M19.2499 0.813071C20.334 -0.271024 22.087 -0.271024 23.1595 0.813071L41.6237 19.2657C42.7078 20.3498 42.7078 22.1028 41.6237 23.1754C40.5396 24.248 38.7866 24.2595 37.7141 23.1754L21.222 6.68332L4.71841 23.1869C3.63432 24.271 1.88131 24.271 0.808751 23.1869C-0.26381 22.1028 -0.275343 20.3498 0.808751 19.2773L19.2499 0.813071Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ArrowUpSvg;

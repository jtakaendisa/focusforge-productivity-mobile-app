import Svg, { Path } from 'react-native-svg';

import { IconProps } from '@/app/entities';

const LockSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 20" fill="none">
      <Path
        d="M8.75 2.5C10.4766 2.5 11.875 3.89844 11.875 5.625V7.5H5.625V5.625C5.625 3.89844 7.02344 2.5 8.75 2.5ZM3.125 5.625V7.5H2.5C1.12109 7.5 0 8.62109 0 10V17.5C0 18.8789 1.12109 20 2.5 20H15C16.3789 20 17.5 18.8789 17.5 17.5V10C17.5 8.62109 16.3789 7.5 15 7.5H14.375V5.625C14.375 2.51953 11.8555 0 8.75 0C5.64453 0 3.125 2.51953 3.125 5.625ZM10 12.5V15C10 15.6914 9.44141 16.25 8.75 16.25C8.05859 16.25 7.5 15.6914 7.5 15V12.5C7.5 11.8086 8.05859 11.25 8.75 11.25C9.44141 11.25 10 11.8086 10 12.5Z"
        fill={fill}
      />
    </Svg>
  );
};

export default LockSvg;

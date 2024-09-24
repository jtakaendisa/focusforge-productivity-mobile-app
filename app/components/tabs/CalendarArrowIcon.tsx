import useCustomColors from '@/app/hooks/useCustomColors';
import ArrowLeftSvg from '../icons/ArrowLeftSvg';
import ArrowRightSvg from '../icons/ArrowRightSvg';

interface Props {
  direction: 'left' | 'right';
}

const SVG_SZIE = 16;

const CalendarArrowIcon = ({ direction }: Props) => {
  const { customRed2 } = useCustomColors();

  if (direction === 'left') {
    return <ArrowLeftSvg size={SVG_SZIE} fill={customRed2} />;
  } else {
    return <ArrowRightSvg size={SVG_SZIE} fill={customRed2} />;
  }
};

export default CalendarArrowIcon;

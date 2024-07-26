import BarChartSvg from '../../icons/BarChartSvg';
import BinSvg from '../../icons/BinSvg';
import CalendarSvg from '../../icons/CalendarSvg';
import PenToSquareSvg from '../../icons/PenToSquareSvg';

interface Props {
  name: 'calendar' | 'statistics' | 'edit' | 'delete';
  fill: string;
}

const SVG_SIZE = 22;

const HabitOptionIcon = ({ name, fill }: Props) => {
  switch (name) {
    case 'calendar':
      return <CalendarSvg size={SVG_SIZE} fill={fill} />;
    case 'statistics':
      return <BarChartSvg size={SVG_SIZE} fill={fill} />;
    case 'edit':
      return <PenToSquareSvg size={SVG_SIZE} fill={fill} variant="outline" />;
    case 'delete':
      return <BinSvg size={SVG_SIZE} fill={fill} />;
  }
};

export default HabitOptionIcon;

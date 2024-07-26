import { IconVariant, TabRoute } from '@/app/entities';
import CheckCircleSvg from '../icons/CheckCircleSvg';
import GearSvg from '../icons/GearSvg';
import MedalSvg from '../icons/MedalSvg';
import NotepadSvg from '../icons/NotepadSvg';
import StopwatchSvg from '../icons/StopwatchSvg';

interface Props {
  currentPath: TabRoute;
  fill: string;
  variant: IconVariant;
}

const SVG_SIZE = 22;

const TabBarIcon = ({ currentPath, fill, variant }: Props) => {
  switch (currentPath) {
    case 'home':
      return <NotepadSvg size={SVG_SIZE} fill={fill} variant={variant} />;
    case 'habits':
      return <MedalSvg size={SVG_SIZE} fill={fill} variant={variant} />;
    case 'tasks':
      return <CheckCircleSvg size={SVG_SIZE} fill={fill} variant={variant} />;
    case 'timer':
      return <StopwatchSvg size={SVG_SIZE} fill={fill} variant={variant} />;
    case 'settings':
      return <GearSvg size={SVG_SIZE} fill={fill} variant={variant} />;
  }
};

export default TabBarIcon;

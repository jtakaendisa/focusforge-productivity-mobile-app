import { IconVariant, TabRoute } from '@/app/entities';
import CheckCircleSvg from '../icons/CheckCircleSvg';
import GearSvg from '../icons/GearSvg';
import HouseSvg from '../icons/HouseSvg';
import MedalSvg from '../icons/MedalSvg';
import StopwatchSvg from '../icons/StopwatchSvg';

interface Props {
  icon: TabRoute;
  size: number;
  fill: string;
  variant: IconVariant;
}

const DrawerItemIcon = ({ icon, size, fill, variant }: Props) => {
  switch (icon) {
    case 'home':
      return <HouseSvg size={size} fill={fill} variant={variant} />;
    case 'habits':
      return <MedalSvg size={size} fill={fill} variant={variant} />;
    case 'tasks':
      return <CheckCircleSvg size={size} fill={fill} variant={variant} />;
    case 'timer':
      return <StopwatchSvg size={size} fill={fill} variant={variant} />;
    case 'settings':
      return <GearSvg size={size} fill={fill} variant={variant} />;
  }
};

export default DrawerItemIcon;

import TrophySvg from '../../icons/TrophySvg';
import LoopSvg from '../../icons/LoopSvg';
import ChecklistSvg from '../../icons/ChecklistSvg';

interface Props {
  name: 'habit' | 'recurring task' | 'single task';
  fill: string;
}

const ActivityTypeIcon = ({ name, fill }: Props) => {
  switch (name) {
    case 'habit':
      return <TrophySvg size={22} fill={fill} />;
    case 'recurring task':
      return <LoopSvg size={22} fill={fill} />;
    case 'single task':
      return <ChecklistSvg size={22} fill={fill} />;
  }
};

export default ActivityTypeIcon;

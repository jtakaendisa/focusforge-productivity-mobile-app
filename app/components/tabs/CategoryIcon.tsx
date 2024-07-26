import { Category } from '@/app/entities';
import BanSvg from '../icons/BanSvg';
import BookSvg from '../icons/BookSvg';
import BriefcaseSvg from '../icons/BriefcaseSvg';
import ClapperboardSvg from '../icons/ClapperboardSvg';
import ClockSvg from '../icons/ClockSvg';
import CoinsSvg from '../icons/CoinsSvg';
import CricketBatBallSvg from '../icons/CricketBatBallSvg';
import HouseSvg from '../icons/HouseSvg';
import MedicalFolderSvg from '../icons/MedicalFolderSvg';
import MeditationSvg from '../icons/MeditationSvg';
import MessagesSvg from '../icons/MessagesSvg';
import PaintBrushSvg from '../icons/PaintBrushSvg';
import PotFoodSvg from '../icons/PotFoodSvg';
import RandomBlocksSvg from '../icons/RandomBlocksSvg';
import TreeBenchSvg from '../icons/TreeBenchSvg';

interface Props {
  category: Category;
  fill: string;
}

const CategoryIcon = ({ category, fill }: Props) => {
  switch (category) {
    case 'Art':
      return <PaintBrushSvg fill={fill} />;
    case 'Recreation':
      return <ClapperboardSvg fill={fill} />;
    case 'Finance':
      return <CoinsSvg fill={fill} />;
    case 'Health':
      return <MedicalFolderSvg fill={fill} />;
    case 'Home':
      return <HouseSvg fill={fill} />;
    case 'Meditation':
      return <MeditationSvg fill={fill} />;
    case 'Nutrition':
      return <PotFoodSvg fill={fill} />;
    case 'Other':
      return <RandomBlocksSvg fill={fill} />;
    case 'Outdoor':
      return <TreeBenchSvg fill={fill} />;
    case 'Quit':
      return <BanSvg fill={fill} />;
    case 'Social':
      return <MessagesSvg fill={fill} />;
    case 'Sports':
      return <CricketBatBallSvg fill={fill} />;
    case 'Study':
      return <BookSvg fill={fill} />;
    case 'Task':
      return <ClockSvg fill={fill} />;
    case 'Work':
      return <BriefcaseSvg fill={fill} />;
  }
};

export default CategoryIcon;

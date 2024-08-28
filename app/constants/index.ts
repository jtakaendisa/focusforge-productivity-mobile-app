import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DATE_CARD_HEIGHT = 66;

const categories = [
  'Task',
  'Quit',
  'Art',
  'Meditation',
  'Study',
  'Sports',
  'Recreation',
  'Social',
  'Finance',
  'Health',
  'Work',
  'Nutrition',
  'Home',
  'Outdoor',
  'Other',
] as const;

const categoryColorMap = {
  Task: '#FF6347',
  Quit: '#8B0000',
  Art: '#FFD700',
  Meditation: '#4B0082',
  Study: '#4682B4',
  Sports: '#32CD32',
  Recreation: '#FF69B4',
  Social: '#FF4500',
  Finance: '#2E8B57',
  Health: '#00FA9A',
  Work: '#708090',
  Nutrition: '#FFDAB9',
  Home: '#8B4513',
  Outdoor: '#228B22',
  Other: '#A9A9A9',
};

export { SCREEN_WIDTH, SCREEN_HEIGHT, DATE_CARD_HEIGHT, categories, categoryColorMap };

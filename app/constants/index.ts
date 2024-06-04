import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TODAYS_DATE = new Date();

const DATE_CARD_HEIGHT = 66;

const colors = {
  white: '#FFF',
  black1: '#111111',
  gray1: '#8C8C8C',
  gray2: '#262626',
  gray3: '#1C1C1C',
  green1: '#2A8844',
  red1: '#C73A57',
  red2: '#C33756',
  red3: '#962C42',
};

export { SCREEN_WIDTH, SCREEN_HEIGHT, TODAYS_DATE, DATE_CARD_HEIGHT };

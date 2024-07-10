import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens as defaultTokens } from '@tamagui/themes';
import { createAnimations } from '@tamagui/animations-moti';
import { createTamagui, createTokens } from 'tamagui';

const headingFont = createInterFont();
const bodyFont = createInterFont();

const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    customBlack1: '#111111',
    customBlack2: '#121212',
    customBlack3: 'rgba(0, 0, 0, 0.6)',
    customGray1: '#8C8C8C',
    customGray2: '#262626',
    customGray3: '#1C1C1C',
    customGray4: 'rgba(140, 140, 140, 0.25)',
    customGray5: '#a8a8a8',
    customGray6: '#333333',
    customGray7: '#dddddd',
    customGray8: '#d3d1d1',
    customGreen1: '#2A8844',
    customRed1: '#C73A57',
    customRed2: '#C33756',
    customRed3: '#962C42',
    customRed4: '#652533',
    customRed5: '#31181E',
    customRed6: 'rgba(150, 44, 66, 0.25)',
  },
});

const animations = createAnimations({
  fast: {
    type: 'timing',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'timing',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'timing',
    damping: 20,
    stiffness: 60,
  },
});

const config = createTamagui({
  light: {
    color: {
      background: 'gray',
      text: 'black',
    },
  },
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes,
  animations,
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;

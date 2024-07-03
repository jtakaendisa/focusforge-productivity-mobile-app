// @ts-nocheck

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
    white: '#FFF',
    black1: '#111111',
    black2: '#121212',
    gray1: '#8C8C8C',
    gray2: '#262626',
    gray3: '#1C1C1C',
    green1: '#2A8844',
    red1: '#C73A57',
    red2: '#C33756',
    red3: '#962C42',
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

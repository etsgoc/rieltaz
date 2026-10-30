export const palettes = {
  dark: {
    bg: '#1E1E1E', surface: '#262626', surface2: '#2D2D2D', line: '#3A3A3A', text: '#EDEDED', muted: '#A3A3A3',
    accent: '#7BA3FF', accentInk: '#0F1626', accentSoft: 'rgba(123,163,255,0.14)',
    ok: '#3DBE86', okSoft: 'rgba(61,190,134,0.14)', warn: '#E3A23B', warnSoft: 'rgba(227,162,59,0.15)',
    danger: '#FF7B6B', shadow: '#000000', overlay: 'rgba(0,0,0,0.6)',
  },
  light: {
    bg: '#F2F3F5', surface: '#FFFFFF', surface2: '#F7F7F9', line: '#E2E3E8', text: '#17181A', muted: '#62666D',
    accent: '#2C58D6', accentInk: '#FFFFFF', accentSoft: 'rgba(44,88,214,0.10)',
    ok: '#1F8A5B', okSoft: 'rgba(31,138,91,0.12)', warn: '#A96A08', warnSoft: 'rgba(169,106,8,0.13)',
    danger: '#C0392B', shadow: '#141620', overlay: 'rgba(10,10,12,0.5)',
  },
};
export type Palette = typeof palettes.dark;
export const radius = { card: 20, button: 14, input: 12, float: 26, pill: 999 };
export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export const TAB_SPACE = 112;

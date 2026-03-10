// ── Premium Dark Theme ──────────────────────────────────────────
export const Colors = {
  bg: '#0a0f1c',
  bgElevated: '#112240',
  bgCard: 'rgba(255,255,255,0.05)',
  bgCardHover: 'rgba(255,255,255,0.08)',
  bgInput: 'rgba(255,255,255,0.06)',
  bgOverlay: 'rgba(0,0,0,0.6)',
  primary: '#27ae60',
  primaryDark: '#1e8e4e',
  primaryGlow: '#34d876',
  primaryMuted: 'rgba(39,174,96,0.15)',
  primaryBorder: 'rgba(39,174,96,0.4)',
  accent: '#64ffda',
  accentMuted: 'rgba(100,255,218,0.15)',
  accentDark: '#00d4aa',
  textPrimary: '#e6f1ff',
  textSecondary: '#8892b0',
  textMuted: '#495670',
  textAccent: '#64ffda',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.12)',
  borderFocus: 'rgba(39,174,96,0.5)',
  error: '#ff6b6b',
  errorMuted: 'rgba(255,107,107,0.15)',
  errorBorder: 'rgba(255,107,107,0.4)',
  warning: '#ffd93d',
  success: '#27ae60',
  info: '#64ffda',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const Glass = {
  card: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  cardElevated: { backgroundColor: Colors.bgCardHover, borderWidth: 1, borderColor: Colors.borderLight },
  input: { backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.borderLight },
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48, section: 40 };
export const Radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 50, circle: 999 };
export const FontSize = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 28, title: 34, hero: 40 };

export const AvatarImages: Record<number, string> = {
  0: '/avatars/avatar0.png',
  1: '/avatars/avatar1.png',
  2: '/avatars/avatar2.png',
  3: '/avatars/avatar3.png',
  4: '/avatars/avatar4.png',
  5: '/avatars/avatar5.png',
  6: '/avatars/avatar6.png',
  7: '/avatars/avatar7.png',
  8: '/avatars/avatar8.png',
  9: '/avatars/avatar9.png',
};

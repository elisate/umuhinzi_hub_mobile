export const lightColors = {
  primary: '#017941ff',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E5E5E5',
  success: '#00C896',
  warning: '#FFA500',
  error: '#FF4757',
  info: '#2E86AB',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#E9ECEF',
  gray200: '#DEE2E6',
  gray300: '#CED4DA',
  gray400: '#ADB5BD',
  gray500: '#6C757D',
  gray600: '#495057',
  gray700: '#343A40',
  gray800: '#212529',
  gray900: '#1A1A1A',
};

export const darkColors = {
  primary: '#017941ff',
  background: '#0E1410',
  card: '#1E261E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#2D4A3A',
  success: '#00FF88',
  warning: '#FCD34D',
  error: '#F87171',
  info: '#60A5FA',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#1E261E',
  gray100: '#2C2B3E',
  gray200: '#3A394E',
  gray300: '#4A495E',
  gray400: '#5A596E',
  gray500: '#6A697E',
  gray600: '#7A798E',
  gray700: '#8A899E',
  gray800: '#9A99AE',
  gray900: '#AAA9BE',
};

export const getThemeColors = (theme: 'light' | 'dark') => {
  return theme === 'light' ? lightColors : darkColors;
};

export type ThemeColors = typeof lightColors;
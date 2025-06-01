/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'; 
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f5f5f5',
    cardBackground: '#fff', 
    tint: tintColorLight, 
    icon: '#555', 
    tabIconDefault: '#687076', 
    tabIconSelected: tintColorLight, 
  },
  dark: {
    text: '#fff', 
    background: '#11151D', 
    cardBackground: '#222D41',
    tint: tintColorDark, 
    icon: '#fff',
    tabIconDefault: '#9BA1A6', 
    tabIconSelected: tintColorDark,
  },
};

// Fonction pour récupérer le thème actif
export const getTheme = (colorScheme: 'light' | 'dark') => {
  return Colors[colorScheme];
};

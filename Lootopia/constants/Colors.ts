/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'; // Couleur principale pour le mode clair
const tintColorDark = '#fff'; // Couleur principale pour le mode sombre

export const Colors = {
  light: {
    text: '#11181C', // Couleur du texte
    background: '#f5f5f5', // Couleur de fond principale
    cardBackground: '#fff', // Couleur de fond des cartes
    tint: tintColorLight, // Couleur d'accentuation
    icon: '#555', // Couleur des icônes
    tabIconDefault: '#687076', // Couleur par défaut des icônes de tabulation
    tabIconSelected: tintColorLight, // Couleur des icônes sélectionnées
  },
  dark: {
    text: '#fff', // Couleur du texte
    background: '#121212', // Couleur de fond principale
    cardBackground: '#1E1E1E', // Couleur de fond des cartes
    tint: tintColorDark, // Couleur d'accentuation
    icon: '#fff', // Couleur des icônes
    tabIconDefault: '#9BA1A6', // Couleur par défaut des icônes de tabulation
    tabIconSelected: tintColorDark, // Couleur des icônes sélectionnées
  },
};

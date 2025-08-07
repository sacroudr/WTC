// mobile/theme.ts

export const colors = {
  primary: '#3168B1',           // Bleu principal (comme web)
  primaryLight: '#5B89CC',      // Variante plus claire pour état désactivé
  primaryLightText: 'rgba(255,255,255,0.8)',

  secondary: '#E42422',         // Rouge secondaire (comme web)
  accent: '#FF2D55',            // Accent optionnel

  background: '#F9F9F9',        // Même background que web
  surface: '#FFFFFF',           // Pour les cartes ou les inputs

  text: '#1D1D1B',              // Texte principal
  textSecondary: '#606264',     // Texte secondaire
  error: '#FF3B30',             // Couleur d'erreur
};

export const spacing = {
  xSmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
};

export const fontSizes = {
  xSmall: 12,
  small: 14,
  medium: 16,
  large: 20,
  xLarge: 28,
  xxLarge: 34,
};

export const fonts = {
  regular: 'OpenSans-Regular',
  bold: 'OpenSans-Bold',
  heading: 'Montserrat-SemiBold',
};

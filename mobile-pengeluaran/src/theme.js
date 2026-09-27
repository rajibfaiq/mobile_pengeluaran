// Design System berdasarkan Stitch UI Design
// Palet warna Material Design 3 dengan aksen teal/hijau

export const Colors = {
  // Primary
  primary: '#005C55',
  primaryContainer: '#0F766E',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#A3FAEF',
  primaryFixedDim: '#80D5CB',

  // Secondary
  secondary: '#466460',
  secondaryContainer: '#C5E6E1',
  secondaryFixedDim: '#ACCDC8',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#4A6864',

  // Tertiary
  tertiary: '#7F4025',
  tertiaryContainer: '#9C573A',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#FFE5DB',

  // Error
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',

  // Surface
  surface: '#F7FAF8',
  surfaceDim: '#D7DBD9',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F1F4F3',
  surfaceContainer: '#EBEFED',
  surfaceContainerHigh: '#E5E9E7',
  surfaceContainerHighest: '#E0E3E1',
  surfaceBright: '#F7FAF8',

  // On Surface
  onSurface: '#181C1C',
  onSurfaceVariant: '#3E4947',
  outline: '#6E7977',
  outlineVariant: '#BDC9C6',

  // Inverse
  inverseSurface: '#2D3130',
  inverseOnSurface: '#EEF1F0',
  inversePrimary: '#80D5CB',

  // Backgrounds
  background: '#F8FAFC',
  darkText: '#0F172A',

  // Separator
  separator: '#F1F5F9',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FontSizes = {
  displayCurrency: 32,
  headlineLg: 24,
  headlineMd: 20,
  headlineSm: 16,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
  labelLg: 14,
  labelMd: 12,
  labelSm: 10,
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Ikon kategori berdasarkan nama kategori
export function getCategoryIcon(kategori) {
  if (!kategori) return 'help-circle-outline';
  const lower = kategori.toLowerCase();
  if (lower.includes('makan') || lower.includes('food')) return 'restaurant';
  if (lower.includes('transport') || lower.includes('bensin')) return 'local-gas-station';
  if (lower.includes('pendidikan') || lower.includes('buku')) return 'menu-book';
  if (lower.includes('kopi') || lower.includes('minum')) return 'local-cafe';
  if (lower.includes('belanja') || lower.includes('shop')) return 'shopping-bag';
  if (lower.includes('kesehatan') || lower.includes('obat')) return 'medical-services';
  if (lower.includes('hiburan') || lower.includes('game')) return 'sports-esports';
  return 'more-horiz';
}

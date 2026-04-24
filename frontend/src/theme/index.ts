import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceMuted: '#2d2d44',
  text: '#fff',
  textSecondary: '#e0e0e0',
  textMuted: '#c8c8c8',
  textDim: '#a0a0a0',
  placeholder: '#6c757d',
  primary: '#6366f1',
  primaryLight: '#a78bfa',
  success: '#22c55e',
  warning: '#f59e0b',
  destructive: '#e85d4c',
  border: '#2d2d44',
  borderLight: 'rgba(34, 197, 94, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  white: '#fff',
} as const;

export const spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  page: 20,
  section: 40,
} as const;

export const fontSizes = {
  xs: 10,
  sm: 11,
  body: 12,
  bodyMd: 13,
  bodyLg: 14,
  base: 16,
  lg: 18,
  xl: 20,
  h3: 24,
  h2: 28,
  h1: 64,
} as const;

export const fontWeights = {
  bold: '600' as const,
  semibold: '700' as const,
  extrabold: '800' as const,
};

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  round: 36,
} as const;

export const layout = {
  screenPadding: spacing.page,
  cardPadding: spacing.xl,
  inputPadding: spacing.xl,
} as const;

export const typography = StyleSheet.create({
  h1: { fontSize: fontSizes.h2, fontWeight: fontWeights.extrabold, color: colors.text },
  h2: { fontSize: fontSizes.h3, fontWeight: fontWeights.extrabold, color: colors.text },
  h3: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, color: colors.text },
  caption: { fontSize: fontSizes.bodyLg, color: colors.placeholder },
  captionSm: { fontSize: fontSizes.bodyMd, color: colors.placeholder },
  label: { fontSize: fontSizes.bodyMd, color: colors.textDim },
  accent: { fontSize: fontSizes.bodyLg, fontWeight: fontWeights.bold, color: colors.primary },
});

export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenWithPadding: { flex: 1, backgroundColor: colors.background, paddingTop: spacing.xl },
  page: { paddingHorizontal: layout.screenPadding },
  pageBottom: { paddingHorizontal: layout.screenPadding, paddingBottom: 100 },
  listBottom: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.section },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: layout.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: layout.inputPadding,
    color: colors.text,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputDark: {
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    padding: layout.inputPadding,
    color: colors.text,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: layout.inputPadding,
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: colors.placeholder,
    paddingVertical: layout.inputPadding,
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: layout.cardPadding,
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  buttonDestructive: {
    backgroundColor: colors.destructive,
    paddingVertical: layout.inputPadding,
    borderRadius: radii.xl,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
  },
  emptyEmoji: { fontSize: fontSizes.h1, marginBottom: spacing.xl },
  emptyText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptySubtext: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyLg,
    marginBottom: spacing.xxxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.xxxl,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    padding: spacing.xxl,
    paddingBottom: 34, // Safe area for iOS
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
});
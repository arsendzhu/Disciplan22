export const colors = {
  backgroundPrimary: "#0F0E0C",
  backgroundSecondary: "#1A1916",
  backgroundTertiary: "#232119",
  accentPrimary: "#E8C97A",
  accentSecondary: "#7EC8A4",
  accentTertiary: "#C98B6A",
  accentQuaternary: "#8BA7D4",
  textPrimary: "#F2EDE4",
  textSecondary: "#9D9589",
  textTertiary: "#635E57",
  border: "#2A2724",
  npcTiredTint: "#2D2418",
  npcHappyTint: "#1A2D1F",
  npcStressedTint: "#2D1A18",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  display: {
    family: "var(--font-display)",
    title: "clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)",
    heading: "clamp(2rem, 1.2rem + 2vw, 3rem)",
    hero: "clamp(3rem, 2rem + 4vw, 4.75rem)",
  },
  body: {
    family: "var(--font-body)",
    size: "0.95rem",
    lineHeight: 1.7,
  },
  mono: {
    family: "var(--font-mono)",
    size: "0.95rem",
  },
} as const;

export const shadows = {
  card: "0 18px 60px rgba(0,0,0,0.34), 0 8px 24px rgba(0,0,0,0.22)",
  glow: "0 0 0 1px rgba(232,201,122,0.16), 0 18px 50px rgba(232,201,122,0.09)",
} as const;

export const gradients = {
  page:
    "radial-gradient(circle at top, rgba(232,201,122,0.08), transparent 34%), radial-gradient(circle at 85% 18%, rgba(139,167,212,0.10), transparent 20%), linear-gradient(180deg, #14120f 0%, #0f0e0c 55%, #0a0908 100%)",
  amber:
    "linear-gradient(135deg, rgba(232,201,122,0.92), rgba(201,139,106,0.78))",
  sage:
    "linear-gradient(135deg, rgba(126,200,164,0.95), rgba(139,167,212,0.78))",
  card:
    "linear-gradient(180deg, rgba(35,33,25,0.96), rgba(26,25,22,0.96))",
} as const;

export const cssVariables = {
  "--background-primary": colors.backgroundPrimary,
  "--background-secondary": colors.backgroundSecondary,
  "--background-tertiary": colors.backgroundTertiary,
  "--accent-primary": colors.accentPrimary,
  "--accent-secondary": colors.accentSecondary,
  "--accent-tertiary": colors.accentTertiary,
  "--accent-quaternary": colors.accentQuaternary,
  "--text-primary": colors.textPrimary,
  "--text-secondary": colors.textSecondary,
  "--text-tertiary": colors.textTertiary,
  "--border-subtle": colors.border,
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  gradients,
  cssVariables,
} as const;

export type Theme = typeof theme;

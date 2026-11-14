import { createTheme } from '@mantine/core'

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

// Shared, contrast-verified (>=4.5:1 on white) status colors. One definition
// reused by StatCard's trend text and the payment status badges so the two
// never drift out of sync.
export const STATUS_TOKENS = {
  success: { color: '#087f5b', badgeBackground: '#e3fbf3' },
  danger: { color: '#b02a2a', badgeBackground: '#ffe3e3' },
  warning: { color: '#b45309', badgeBackground: '#fff6db' },
  info: { color: '#364fc7', badgeBackground: '#e8ecff' },
} as const

export const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily: FONT_FAMILY,
  headings: {
    fontFamily: FONT_FAMILY,
    fontWeight: '600',
  },
})

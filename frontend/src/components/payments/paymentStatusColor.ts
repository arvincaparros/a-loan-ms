import { STATUS_TOKENS } from '../../theme'
import type { PaymentStatus } from '../../types'

export function getPaymentStatusColor(status: PaymentStatus) {
  switch (status) {
    case 'Paid':
      return 'teal'
    case 'Overdue':
      return 'red'
    case 'Upcoming':
      return 'yellow'
  }
}

// Contrast-verified foreground/background pairs (>=4.5:1), for call sites
// that need guaranteed-AA badge colors instead of Mantine's default "light"
// variant derivation.
export const PAYMENT_STATUS_BADGE_STYLE: Record<PaymentStatus, { background: string; color: string }> = {
  Paid: { background: STATUS_TOKENS.success.badgeBackground, color: STATUS_TOKENS.success.color },
  Overdue: { background: STATUS_TOKENS.danger.badgeBackground, color: STATUS_TOKENS.danger.color },
  Upcoming: { background: STATUS_TOKENS.warning.badgeBackground, color: STATUS_TOKENS.warning.color },
}

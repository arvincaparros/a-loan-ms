import { STATUS_TOKENS } from '../../theme'
import type { BorrowerStatus } from '../../types'

export function getBorrowerStatusColor(status: BorrowerStatus) {
  switch (status) {
    case 'Active':
      return 'indigo'
    case 'Paid':
      return 'teal'
    case 'Overdue':
      return 'red'
  }
}

// Contrast-verified foreground/background pairs (>=4.5:1), for call sites
// that need guaranteed-AA badge colors instead of Mantine's default "light"
// variant derivation.
export const BORROWER_STATUS_BADGE_STYLE: Record<BorrowerStatus, { background: string; color: string }> = {
  Active: { background: STATUS_TOKENS.info.badgeBackground, color: STATUS_TOKENS.info.color },
  Paid: { background: STATUS_TOKENS.success.badgeBackground, color: STATUS_TOKENS.success.color },
  Overdue: { background: STATUS_TOKENS.danger.badgeBackground, color: STATUS_TOKENS.danger.color },
}

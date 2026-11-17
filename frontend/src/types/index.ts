export type KpiTrend = 'up' | 'down' | 'neutral' | 'warning'

export interface KpiStat {
  id: string
  label: string
  value: string
  change: string
  trend: KpiTrend
}

export interface MonthlyCollection {
  month: string
  amount: number
}

export interface LoanStatusSegment {
  status: string
  count: number
  color: string
}

export type PaymentStatus = 'Paid' | 'Upcoming' | 'Overdue'

export interface RecentPayment {
  borrower: string
  amount: string
  date: string
  status: PaymentStatus
}

export interface UpcomingPayment {
  borrower: string
  dueDate: string
  amount: string
  status: PaymentStatus
}

export type BorrowerStatus = 'Active' | 'Paid' | 'Overdue'

export interface Borrower {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  address?: string
  activeLoan: string
  totalPaid: string
  balance: string
  status: BorrowerStatus
}

export interface ApiBorrower {
  id: number
  full_name: string
  email: string
  phone: string
  address: string
  status: BorrowerStatus
  created_at: string
  updated_at: string
}

export interface ApiBorrowerListResponse {
  items: ApiBorrower[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface SummaryStat {
  id: string
  label: string
  value: string
}

export interface LoanDetail {
  loanNumber: string
  startedDate: string
  originalLoan: string
  interestRate: string
  interest: string
  totalPayable: string
  totalPaid: string
  outstandingBalance: string
  dueDate: string
  status: BorrowerStatus
  paidPercent: number
  nextPaymentDate: string
  nextPaymentAmount: string
  loanTerm: string
}

export interface LoanPaymentRecord {
  date: string
  amount: string
  previousBalance: string
  remainingBalance: string
  status: PaymentStatus
}

export interface Loan {
  id: string
  loanNumber: string
  startedDate: string
  borrowerId: string
  principal: string
  totalPayable: string
  totalPaid: string
  balance: string
  dueDate: string
  status: BorrowerStatus
}

export interface Payment {
  id: string
  borrowerId: string
  loanId: string
  amount: string
  date: string
  balanceAfter: string
  status: PaymentStatus
}

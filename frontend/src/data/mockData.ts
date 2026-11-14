import type {
  Borrower,
  KpiStat,
  Loan,
  LoanDetail,
  LoanPaymentRecord,
  LoanStatusSegment,
  MonthlyCollection,
  Payment,
  RecentPayment,
  SummaryStat,
  UpcomingPayment,
} from '../types'

export const kpiStats: KpiStat[] = [
  {
    id: 'total-loaned',
    label: 'Total Loaned',
    value: '₱250,000',
    change: '+12% from last month',
    trend: 'up',
  },
  {
    id: 'total-collected',
    label: 'Total Collected',
    value: '₱164,500',
    change: '+8% from last month',
    trend: 'up',
  },
  {
    id: 'outstanding-balance',
    label: 'Outstanding Balance',
    value: '₱85,500',
    change: '5% from last month',
    trend: 'neutral',
  },
  {
    id: 'active-loans',
    label: 'Active Loans',
    value: '12',
    change: '4 overdue',
    trend: 'warning',
  },
]

export const monthlyCollections: MonthlyCollection[] = [
  { month: 'Jan', amount: 5000 },
  { month: 'Feb', amount: 10000 },
  { month: 'Mar', amount: 15000 },
  { month: 'Apr', amount: 20000 },
  { month: 'May', amount: 15000 },
  { month: 'Jun', amount: 24000 },
  { month: 'Jul', amount: 28000 },
  { month: 'Aug', amount: 24000 },
  { month: 'Sep', amount: 32000 },
  { month: 'Oct', amount: 24000 },
]

export const loanStatusBreakdown: LoanStatusSegment[] = [
  { status: 'Active', count: 12, color: 'var(--mantine-color-indigo-6)' },
  { status: 'Paid', count: 24, color: 'var(--mantine-color-teal-6)' },
  { status: 'Overdue', count: 4, color: 'var(--mantine-color-red-6)' },
]

export const recentPayments: RecentPayment[] = [
  { borrower: 'Maria Santos', amount: '₱2,500', date: 'Oct 01, 2026', status: 'Paid' },
  { borrower: 'John Cruz', amount: '₱3,000', date: 'Sep 30, 2026', status: 'Paid' },
  { borrower: 'Anna Reyes', amount: '₱1,500', date: 'Sep 29, 2026', status: 'Paid' },
  { borrower: 'Carlos Dela Cruz', amount: '₱4,000', date: 'Sep 28, 2026', status: 'Paid' },
]

export const upcomingPayments: UpcomingPayment[] = [
  { borrower: 'Maria Santos', dueDate: 'Oct 05, 2026', amount: '₱2,500', status: 'Upcoming' },
  { borrower: 'John Cruz', dueDate: 'Sep 28, 2026', amount: '₱3,000', status: 'Overdue' },
  { borrower: 'Peter Lim', dueDate: 'Oct 03, 2026', amount: '₱1,500', status: 'Upcoming' },
  { borrower: 'Ana Reyes', dueDate: 'Sep 30, 2026', amount: '₱2,000', status: 'Overdue' },
]

export const borrowerSummaryStats: SummaryStat[] = [
  { id: 'total-borrowers', label: 'Total Borrowers', value: '32' },
  { id: 'active-borrowers', label: 'Active Borrowers', value: '12' },
  { id: 'fully-paid-borrowers', label: 'Fully Paid', value: '16' },
]

export const borrowers: Borrower[] = [
  {
    id: 'maria-santos',
    name: 'Maria Santos',
    initials: 'MS',
    email: 'maria@example.com',
    phone: '0912 345 6789',
    address: 'Quezon City, Philippines',
    activeLoan: '₱30,000',
    totalPaid: '₱13,500',
    balance: '₱18,000',
    status: 'Active',
  },
  {
    id: 'john-cruz',
    name: 'John Cruz',
    initials: 'JC',
    email: 'john@example.com',
    phone: '0917 123 4567',
    activeLoan: '₱20,000',
    totalPaid: '₱15,000',
    balance: '₱5,000',
    status: 'Overdue',
  },
  {
    id: 'anna-reyes',
    name: 'Anna Reyes',
    initials: 'AR',
    email: 'anna@example.com',
    phone: '0922 987 6543',
    activeLoan: '₱15,000',
    totalPaid: '₱15,000',
    balance: '₱0',
    status: 'Paid',
  },
  {
    id: 'carlos-dela-cruz',
    name: 'Carlos Dela Cruz',
    initials: 'CD',
    email: 'carlos@example.com',
    phone: '0918 765 4321',
    activeLoan: '₱25,000',
    totalPaid: '₱12,500',
    balance: '₱12,500',
    status: 'Active',
  },
  {
    id: 'peter-lim',
    name: 'Peter Lim',
    initials: 'PL',
    email: 'peter@example.com',
    phone: '0916 111 2233',
    activeLoan: '₱10,000',
    totalPaid: '₱10,000',
    balance: '₱0',
    status: 'Paid',
  },
]

export const borrowerProfile: Borrower = borrowers.find((borrower) => borrower.id === 'maria-santos')!

export const borrowerLoanDetail: LoanDetail = {
  loanNumber: 'LN-2026-001',
  startedDate: 'Sep 01, 2026',
  originalLoan: '₱30,000',
  interestRate: '5%',
  interest: '₱1,500',
  totalPayable: '₱31,500',
  totalPaid: '₱13,500',
  outstandingBalance: '₱18,000',
  dueDate: 'Dec 01, 2026',
  status: 'Active',
  paidPercent: 43,
  nextPaymentDate: 'Oct 15, 2026',
  nextPaymentAmount: '₱3,000',
  loanTerm: '3 months',
}

export const borrowerPaymentHistory: LoanPaymentRecord[] = [
  { date: 'Oct 01, 2026', amount: '₱3,000', previousBalance: '₱21,000', remainingBalance: '₱18,000', status: 'Paid' },
  { date: 'Sep 15, 2026', amount: '₱3,000', previousBalance: '₱24,000', remainingBalance: '₱21,000', status: 'Paid' },
  { date: 'Sep 01, 2026', amount: '₱3,000', previousBalance: '₱27,000', remainingBalance: '₱24,000', status: 'Paid' },
  { date: 'Aug 15, 2026', amount: '₱3,000', previousBalance: '₱30,000', remainingBalance: '₱27,000', status: 'Paid' },
]

export const loanSummaryStats: SummaryStat[] = [
  { id: 'total-loans', label: 'Total Loans', value: '40' },
  { id: 'active-loans', label: 'Active Loans', value: '12' },
  { id: 'fully-paid-loans', label: 'Fully Paid', value: '24' },
  { id: 'overdue-loans', label: 'Overdue', value: '4' },
]

export const loans: Loan[] = [
  {
    id: 'LN-2026-001',
    loanNumber: 'LN-2026-001',
    startedDate: 'Sep 01, 2026',
    borrowerId: 'maria-santos',
    principal: '₱30,000',
    totalPayable: '₱31,500',
    totalPaid: '₱13,500',
    balance: '₱18,000',
    dueDate: 'Dec 01, 2026',
    status: 'Active',
  },
  {
    id: 'LN-2026-002',
    loanNumber: 'LN-2026-002',
    startedDate: 'Jun 28, 2026',
    borrowerId: 'john-cruz',
    principal: '₱20,000',
    totalPayable: '₱21,000',
    totalPaid: '₱16,000',
    balance: '₱5,000',
    dueDate: 'Sep 28, 2026',
    status: 'Overdue',
  },
  {
    id: 'LN-2026-003',
    loanNumber: 'LN-2026-003',
    startedDate: 'Jun 15, 2026',
    borrowerId: 'anna-reyes',
    principal: '₱15,000',
    totalPayable: '₱15,750',
    totalPaid: '₱15,750',
    balance: '₱0',
    dueDate: 'Sep 15, 2026',
    status: 'Paid',
  },
  {
    id: 'LN-2026-004',
    loanNumber: 'LN-2026-004',
    startedDate: 'Sep 15, 2026',
    borrowerId: 'carlos-dela-cruz',
    principal: '₱25,000',
    totalPayable: '₱26,250',
    totalPaid: '₱13,750',
    balance: '₱12,500',
    dueDate: 'Dec 15, 2026',
    status: 'Active',
  },
  {
    id: 'LN-2026-005',
    loanNumber: 'LN-2026-005',
    startedDate: 'May 30, 2026',
    borrowerId: 'peter-lim',
    principal: '₱10,000',
    totalPayable: '₱10,500',
    totalPaid: '₱10,500',
    balance: '₱0',
    dueDate: 'Aug 30, 2026',
    status: 'Paid',
  },
]

export const paymentSummaryStats: SummaryStat[] = [
  { id: 'total-collected', label: 'Total Collected', value: '₱164,500' },
  { id: 'collected-this-month', label: 'Collected This Month', value: '₱24,000' },
  { id: 'pending-this-month', label: 'Pending This Month', value: '₱12,500' },
  { id: 'overdue-amount', label: 'Overdue Amount', value: '₱8,000' },
]

export const payments: Payment[] = [
  {
    id: 'PAY-2026-041',
    borrowerId: 'maria-santos',
    loanId: 'LN-2026-001',
    amount: '₱3,000',
    date: 'Oct 01, 2026',
    balanceAfter: '₱18,000',
    status: 'Paid',
  },
  {
    id: 'PAY-2026-040',
    borrowerId: 'john-cruz',
    loanId: 'LN-2026-002',
    amount: '₱3,000',
    date: 'Sep 30, 2026',
    balanceAfter: '₱5,000',
    status: 'Paid',
  },
  {
    id: 'PAY-2026-039',
    borrowerId: 'anna-reyes',
    loanId: 'LN-2026-003',
    amount: '₱1,500',
    date: 'Sep 29, 2026',
    balanceAfter: '₱0',
    status: 'Paid',
  },
  {
    id: 'PAY-2026-038',
    borrowerId: 'carlos-dela-cruz',
    loanId: 'LN-2026-004',
    amount: '₱4,000',
    date: 'Sep 28, 2026',
    balanceAfter: '₱12,500',
    status: 'Paid',
  },
  {
    id: 'PAY-2026-037',
    borrowerId: 'peter-lim',
    loanId: 'LN-2026-005',
    amount: '₱1,500',
    date: 'Sep 15, 2026',
    balanceAfter: '₱0',
    status: 'Paid',
  },
]

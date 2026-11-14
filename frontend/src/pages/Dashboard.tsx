import { Badge, Button, Card, Grid, Group, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core'
import { PiggyBank, Receipt, Wallet, HandCoins, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PAYMENT_STATUS_BADGE_STYLE } from '../components/payments/paymentStatusColor'
import { LoanStatusChart } from '../components/dashboard/LoanStatusChart'
import { MonthlyCollectionsChart } from '../components/dashboard/MonthlyCollectionsChart'
import { StatCard } from '../components/dashboard/StatCard'
import {
  kpiStats,
  loanStatusBreakdown,
  monthlyCollections,
  recentPayments,
  upcomingPayments,
} from '../data/mockData'

const KPI_ICONS: Record<string, LucideIcon> = {
  'total-loaned': Wallet,
  'total-collected': PiggyBank,
  'outstanding-balance': Receipt,
  'active-loans': HandCoins,
}

export default function Dashboard() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Overview</Title>
        <Text size="sm" c="dimmed">
          Monitor your loan portfolio, collections, and payment activity.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {kpiStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={KPI_ICONS[stat.id]}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </SimpleGrid>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Title order={3} mb="md">
              Monthly Collections
            </Title>
            <MonthlyCollectionsChart data={monthlyCollections} />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Title order={3} mb="md">
              Loan Status
            </Title>
            <LoanStatusChart data={loanStatusBreakdown} />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg">
            <Group justify="space-between" mb="md">
              <Title order={3}>Recent Payments</Title>
              <Button variant="subtle" color="indigo" size="xs" component={Link} to="/payments">
                View all
              </Button>
            </Group>
            <Table.ScrollContainer minWidth={420}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Borrower</Table.Th>
                    <Table.Th ta="right">Amount</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentPayments.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text size="sm" c="dimmed" ta="center" py="md">
                          No recent payments yet.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    recentPayments.map((payment) => (
                      <Table.Tr key={`${payment.borrower}-${payment.date}`}>
                        <Table.Td>{payment.borrower}</Table.Td>
                        <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {payment.amount}
                        </Table.Td>
                        <Table.Td>{payment.date}</Table.Td>
                        <Table.Td>
                          <Badge style={PAYMENT_STATUS_BADGE_STYLE[payment.status]}>{payment.status}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg">
            <Group justify="space-between" mb="md">
              <Title order={3}>Upcoming / Overdue Payments</Title>
              <Button variant="subtle" color="indigo" size="xs" component={Link} to="/payments">
                View all
              </Button>
            </Group>
            <Table.ScrollContainer minWidth={420}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Borrower</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th ta="right">Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {upcomingPayments.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text size="sm" c="dimmed" ta="center" py="md">
                          No upcoming or overdue payments.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    upcomingPayments.map((payment) => (
                      <Table.Tr key={`${payment.borrower}-${payment.dueDate}`}>
                        <Table.Td>{payment.borrower}</Table.Td>
                        <Table.Td>{payment.dueDate}</Table.Td>
                        <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {payment.amount}
                        </Table.Td>
                        <Table.Td>
                          <Badge style={PAYMENT_STATUS_BADGE_STYLE[payment.status]}>{payment.status}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

import {
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Progress,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from '@mantine/core'
import { ArrowLeft, Mail, MapPin, Pencil, Phone, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BORROWER_STATUS_BADGE_STYLE } from '../components/borrowers/statusColor'
import { PAYMENT_STATUS_BADGE_STYLE } from '../components/payments/paymentStatusColor'
import { borrowerLoanDetail, borrowerPaymentHistory, borrowerProfile } from '../data/mockData'

const summaryRows: { label: string; value: string; emphasize?: boolean }[] = [
  { label: 'Original Loan', value: borrowerLoanDetail.originalLoan },
  { label: 'Interest Rate', value: borrowerLoanDetail.interestRate },
  { label: 'Interest', value: borrowerLoanDetail.interest },
  { label: 'Total Payable', value: borrowerLoanDetail.totalPayable },
  { label: 'Total Paid', value: borrowerLoanDetail.totalPaid },
  { label: 'Outstanding Balance', value: borrowerLoanDetail.outstandingBalance, emphasize: true },
  { label: 'Due Date', value: borrowerLoanDetail.dueDate },
]

export default function BorrowerDetails() {
  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/borrowers" underline="never" c="dimmed" size="sm">
        <Group gap={4}>
          <ArrowLeft size={14} />
          <span>Back to Borrowers</span>
        </Group>
      </Anchor>

      <Card withBorder radius="md" padding="lg">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap="md"
        >
          <Group gap="md" align="flex-start">
            <Avatar color="indigo" radius="xl" size={56}>
              {borrowerProfile.initials}
            </Avatar>
            <Stack gap={6}>
              <Group gap="sm">
                <Title order={2} size="h3">
                  {borrowerProfile.name}
                </Title>
                <Badge style={BORROWER_STATUS_BADGE_STYLE[borrowerProfile.status]}>
                  {borrowerProfile.status}
                </Badge>
              </Group>
              <Stack gap={4}>
                <Group gap={8} wrap="nowrap">
                  <Mail size={14} aria-hidden="true" style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />
                  <Text size="sm" c="dimmed">
                    {borrowerProfile.email}
                  </Text>
                </Group>
                <Group gap={8} wrap="nowrap">
                  <Phone size={14} aria-hidden="true" style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />
                  <Text size="sm" c="dimmed">
                    {borrowerProfile.phone}
                  </Text>
                </Group>
                <Group gap={8} wrap="nowrap">
                  <MapPin size={14} aria-hidden="true" style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />
                  <Text size="sm" c="dimmed">
                    {borrowerProfile.address}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Group>
          <Button variant="default" leftSection={<Pencil size={16} />}>
            Edit Borrower
          </Button>
        </Flex>
      </Card>

      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="loans">Loans</Tabs.Tab>
          <Tabs.Tab value="payments">Payments</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Title order={3} size="h4" mb="md">
              Loan Summary
            </Title>
            <Stack gap="xs">
              {summaryRows.map((row) => (
                <Group key={row.label} justify="space-between">
                  <Text size="sm" c="dimmed">
                    {row.label}
                  </Text>
                  <Text
                    size={row.emphasize ? 'md' : 'sm'}
                    fw={row.emphasize ? 700 : 500}
                    c={row.emphasize ? 'indigo' : undefined}
                    ta="right"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {row.value}
                  </Text>
                </Group>
              ))}
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Status
                </Text>
                <Badge style={BORROWER_STATUS_BADGE_STYLE[borrowerLoanDetail.status]}>
                  {borrowerLoanDetail.status}
                </Badge>
              </Group>
            </Stack>
            <Divider my="md" />
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Loan #{borrowerLoanDetail.loanNumber}
              </Text>
              <Text size="xs" c="dimmed">
                Started {borrowerLoanDetail.startedDate}
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Title order={3} size="h4" mb="md">
              Payment Progress
            </Title>
            <Group justify="space-between" mb={4}>
              <Text size="sm" fw={600}>
                {borrowerLoanDetail.paidPercent}% Paid
              </Text>
              <Text size="sm" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {borrowerLoanDetail.totalPaid} of {borrowerLoanDetail.totalPayable}
              </Text>
            </Group>
            <Progress value={borrowerLoanDetail.paidPercent} color="indigo" radius="xl" size="lg" />
            <Stack gap="xs" mt="lg">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Remaining Balance
                </Text>
                <Text size="sm" fw={600} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.outstandingBalance}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Next Payment
                </Text>
                <Text size="sm" fw={600}>
                  {borrowerLoanDetail.nextPaymentDate}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Next Amount
                </Text>
                <Text size="sm" fw={600} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.nextPaymentAmount}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder radius="md" padding="lg">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap="sm"
          mb="md"
        >
          <div>
            <Title order={3} size="h4">
              Payment History
            </Title>
            <Text size="sm" c="dimmed">
              Recent payments for this loan
            </Text>
          </div>
          <Button color="indigo" leftSection={<Plus size={16} />}>
            Add Payment
          </Button>
        </Flex>
        <Table.ScrollContainer minWidth={600}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
                <Table.Th ta="right">Previous Balance</Table.Th>
                <Table.Th ta="right">Remaining Balance</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {borrowerPaymentHistory.map((record) => (
                <Table.Tr key={record.date}>
                  <Table.Td>{record.date}</Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {record.amount}
                  </Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {record.previousBalance}
                  </Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {record.remainingBalance}
                  </Table.Td>
                  <Table.Td>
                    <Badge style={PAYMENT_STATUS_BADGE_STYLE[record.status]}>{record.status}</Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  )
}

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Calendar, ChevronLeft, ChevronRight, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PAYMENT_STATUS_BADGE_STYLE } from '../components/payments/paymentStatusColor'
import { borrowers, loans, paymentSummaryStats, payments } from '../data/mockData'

export default function Payments() {
  return (
    <Stack gap="xl">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        gap="sm"
      >
        <div>
          <Title order={2}>Payment Management</Title>
          <Text size="sm" c="dimmed">
            Track loan payments, collections, and outstanding balances.
          </Text>
        </div>
        <Button color="indigo" leftSection={<Plus size={16} />} component={Link} to="/payments/new">
          Record Payment
        </Button>
      </Flex>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {paymentSummaryStats.map((stat) => (
          <Paper key={stat.id} withBorder radius="md" p="lg">
            <Text size="sm" c="dimmed" fw={500}>
              {stat.label}
            </Text>
            <Text size="xl" fw={700} mt={4}>
              {stat.value}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" gap="sm">
        <TextInput
          placeholder="Search borrower or loan ID..."
          leftSection={<Search size={16} />}
          w={{ base: '100%', sm: 320 }}
        />
        <Group gap="sm" wrap="wrap">
          <Select
            data={['All Status', 'Paid', 'Upcoming', 'Overdue']}
            defaultValue="All Status"
            leftSection={<Filter size={16} />}
            w={{ base: '100%', sm: 160 }}
          />
          <Select
            data={['October 2026']}
            defaultValue="October 2026"
            leftSection={<Calendar size={16} />}
            w={{ base: '100%', sm: 160 }}
          />
        </Group>
      </Flex>

      <Card withBorder radius="md" padding="lg">
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Payment</Table.Th>
                <Table.Th>Borrower</Table.Th>
                <Table.Th>Loan</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
                <Table.Th>Payment Date</Table.Th>
                <Table.Th ta="right">Balance After</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payments.map((payment) => {
                const borrower = borrowers.find((candidate) => candidate.id === payment.borrowerId)
                const loan = loans.find((candidate) => candidate.id === payment.loanId)

                return (
                  <Table.Tr key={payment.id}>
                    <Table.Td>
                      <Text fw={600} size="sm">
                        {payment.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar color="indigo" radius="xl" size={32}>
                          {borrower?.initials}
                        </Avatar>
                        <Text size="sm">{borrower?.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {loan?.loanNumber}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {payment.amount}
                    </Table.Td>
                    <Table.Td style={{ fontVariantNumeric: 'tabular-nums' }}>{payment.date}</Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <Text fw={600} size="sm">
                        {payment.balanceAfter}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge style={PAYMENT_STATUS_BADGE_STYLE[payment.status]}>{payment.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        aria-label={`More actions for payment ${payment.id}`}
                      >
                        <MoreHorizontal size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap="sm"
          mt="md"
        >
          <Text size="sm" c="dimmed">
            Showing 5 of 48 payments
          </Text>
          <Group gap={4}>
            <ActionIcon variant="subtle" color="gray" aria-label="Previous page">
              <ChevronLeft size={16} />
            </ActionIcon>
            <Button variant="filled" color="indigo" size="xs" radius="md">
              1
            </Button>
            <Button variant="subtle" color="gray" size="xs" radius="md">
              2
            </Button>
            <Button variant="subtle" color="gray" size="xs" radius="md">
              3
            </Button>
            <Text size="sm" c="dimmed" px={4}>
              ...
            </Text>
            <Button variant="subtle" color="gray" size="xs" radius="md">
              10
            </Button>
            <ActionIcon variant="subtle" color="gray" aria-label="Next page">
              <ChevronRight size={16} />
            </ActionIcon>
          </Group>
        </Flex>
      </Card>
    </Stack>
  )
}

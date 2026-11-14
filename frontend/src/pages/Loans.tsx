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
import { ChevronLeft, ChevronRight, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BORROWER_STATUS_BADGE_STYLE } from '../components/borrowers/statusColor'
import { borrowers, loanSummaryStats, loans } from '../data/mockData'

export default function Loans() {
  return (
    <Stack gap="lg">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        gap="sm"
      >
        <div>
          <Title order={2}>Loan Management</Title>
          <Text size="sm" c="dimmed">
            View and manage borrower loans, balances, and due dates.
          </Text>
        </div>
        <Button color="indigo" leftSection={<Plus size={16} />} component={Link} to="/loans/new">
          Create Loan
        </Button>
      </Flex>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {loanSummaryStats.map((stat) => (
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
        <Select
          data={['All Status', 'Active', 'Paid', 'Overdue']}
          defaultValue="All Status"
          leftSection={<Filter size={16} />}
          w={{ base: '100%', sm: 180 }}
        />
      </Flex>

      <Card withBorder radius="md" padding="lg">
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Loan</Table.Th>
                <Table.Th>Borrower</Table.Th>
                <Table.Th ta="right">Principal</Table.Th>
                <Table.Th ta="right">Total Payable</Table.Th>
                <Table.Th ta="right">Total Paid</Table.Th>
                <Table.Th ta="right">Balance</Table.Th>
                <Table.Th>Due Date</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loans.map((loan) => {
                const borrower = borrowers.find((candidate) => candidate.id === loan.borrowerId)

                return (
                  <Table.Tr key={loan.id}>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text fw={600} size="sm">
                          {loan.loanNumber}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {loan.startedDate}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar color="indigo" radius="xl" size={32}>
                          {borrower?.initials}
                        </Avatar>
                        <Text size="sm">{borrower?.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {loan.principal}
                    </Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {loan.totalPayable}
                    </Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {loan.totalPaid}
                    </Table.Td>
                    <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <Text fw={600} size="sm">
                        {loan.balance}
                      </Text>
                    </Table.Td>
                    <Table.Td>{loan.dueDate}</Table.Td>
                    <Table.Td>
                      <Badge style={BORROWER_STATUS_BADGE_STYLE[loan.status]}>{loan.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="subtle" color="gray" aria-label={`More actions for loan ${loan.loanNumber}`}>
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
            Showing 5 of 40 loans
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
              8
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

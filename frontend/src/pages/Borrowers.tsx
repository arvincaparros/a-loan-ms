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
import { ChevronLeft, ChevronRight, Filter, MoreHorizontal, Search, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BORROWER_STATUS_BADGE_STYLE } from '../components/borrowers/statusColor'
import { borrowerSummaryStats, borrowers } from '../data/mockData'

export default function Borrowers() {
  return (
    <Stack gap="lg">
      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'flex-start', sm: 'center' }} gap="sm">
        <div>
          <Title order={2}>Borrower Management</Title>
          <Text size="sm" c="dimmed">
            View and manage borrower information and loan balances.
          </Text>
        </div>
        <Button color="indigo" leftSection={<UserPlus size={16} />} component={Link} to="/borrowers/new">
          Add Borrower
        </Button>
      </Flex>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {borrowerSummaryStats.map((stat) => (
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
          placeholder="Search borrowers..."
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
        <Table.ScrollContainer minWidth={760}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Borrower</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th ta="right">Active Loan</Table.Th>
                <Table.Th ta="right">Total Paid</Table.Th>
                <Table.Th ta="right">Balance</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {borrowers.map((borrower) => (
                <Table.Tr key={borrower.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color="indigo" radius="xl" size={36}>
                        {borrower.initials}
                      </Avatar>
                      <Text fw={500} size="sm">
                        {borrower.name}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text size="sm">{borrower.email}</Text>
                      <Text size="xs" c="dimmed">
                        {borrower.phone}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {borrower.activeLoan}
                  </Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {borrower.totalPaid}
                  </Table.Td>
                  <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {borrower.balance}
                  </Table.Td>
                  <Table.Td>
                    <Badge style={BORROWER_STATUS_BADGE_STYLE[borrower.status]}>{borrower.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="subtle" color="gray" aria-label={`More actions for ${borrower.name}`}>
                      <MoreHorizontal size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'flex-start', sm: 'center' }} gap="sm" mt="md">
          <Text size="sm" c="dimmed">
            Showing 5 of 32 borrowers
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
              7
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

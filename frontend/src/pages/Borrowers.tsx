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
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BORROWER_STATUS_BADGE_STYLE } from '../components/borrowers/statusColor'
import { borrowerSummaryStats } from '../data/mockData'
import { useBorrowers } from '../hooks/useBorrowers'
import type { BorrowerStatus } from '../types'

const STATUS_OPTIONS = ['All Status', 'Active', 'Paid', 'Overdue']

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function Borrowers() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BorrowerStatus | null>(null)
  const [page, setPage] = useState(1)

  // shortcut: fixed 300ms debounce, no cancel-on-unmount edge case handled beyond clearTimeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, loading, error } = useBorrowers({ search, status, page })

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
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
        />
        <Select
          data={STATUS_OPTIONS}
          value={status ?? 'All Status'}
          onChange={(value) => {
            setStatus(value && value !== 'All Status' ? (value as BorrowerStatus) : null)
            setPage(1)
          }}
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
                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {!loading && !error && data?.items.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text size="sm" c="dimmed" ta="center" py="lg">
                      No borrowers found.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
              {!loading &&
                !error &&
                data?.items.map((borrower) => (
                  <Table.Tr key={borrower.id}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar color="indigo" radius="xl" size={36}>
                          {initialsFromName(borrower.full_name)}
                        </Avatar>
                        <Text fw={500} size="sm">
                          {borrower.full_name}
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
                    <Table.Td>
                      <Badge style={BORROWER_STATUS_BADGE_STYLE[borrower.status]}>{borrower.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="subtle" color="gray" aria-label={`More actions for ${borrower.full_name}`}>
                        <MoreHorizontal size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {loading && (
          <Text size="sm" c="dimmed" ta="center" py="lg">
            Loading borrowers...
          </Text>
        )}
        {error && (
          <Text size="sm" c="red" ta="center" py="lg">
            Failed to load borrowers: {error}
          </Text>
        )}

        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'flex-start', sm: 'center' }} gap="sm" mt="md">
          <Text size="sm" c="dimmed">
            {!loading && !error && data ? `Showing ${data.items.length} of ${data.total} borrowers` : ' '}
          </Text>
          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="Previous page"
              disabled={loading || !!error || !data || data.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </ActionIcon>
            <Text size="sm" c="dimmed" px={4}>
              {!loading && !error && data ? `Page ${data.page} of ${Math.max(data.total_pages, 1)}` : ''}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="Next page"
              disabled={loading || !!error || !data || data.page >= data.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </ActionIcon>
          </Group>
        </Flex>
      </Card>
    </Stack>
  )
}

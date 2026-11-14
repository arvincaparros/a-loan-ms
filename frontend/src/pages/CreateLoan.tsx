import {
  Anchor,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { ArrowLeft, Calendar, Info, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { borrowerLoanDetail, borrowerProfile, borrowers } from '../data/mockData'

const borrowerNames = borrowers.map((borrower) => borrower.name)
const dateFormat = 'MMM DD, YYYY'

export default function CreateLoan() {
  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/loans" underline="never" c="dimmed" size="sm">
        <Group gap={4}>
          <ArrowLeft size={14} />
          <span>Back to Loans</span>
        </Group>
      </Anchor>

      <div>
        <Title order={2}>Create New Loan</Title>
        <Text size="sm" c="dimmed">
          Set up a new loan for an existing borrower.
        </Text>
      </div>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={3} size="h4" mb="md">
              Loan Information
            </Title>
            <Stack gap="md">
              <Select
                label="Borrower"
                placeholder="Select a borrower"
                description="Select the borrower receiving this loan."
                data={borrowerNames}
                defaultValue={borrowerProfile.name}
              />

              <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Principal Amount"
                    description="Total amount being lent to the borrower."
                    placeholder="Enter principal amount"
                    defaultValue={30000}
                    prefix="₱"
                    thousandSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Interest Rate"
                    description="Flat rate applied to the principal."
                    placeholder="Enter interest rate"
                    defaultValue={5}
                    suffix="%"
                  />
                </Grid.Col>
              </Grid>

              <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Start Date"
                    leftSection={<Calendar size={16} />}
                    defaultValue={new Date(2026, 8, 1)}
                    valueFormat={dateFormat}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Due Date"
                    leftSection={<Calendar size={16} />}
                    defaultValue={new Date(2026, 11, 1)}
                    valueFormat={dateFormat}
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end" mt="md">
                <Button variant="default" component={Link} to="/loans">
                  Cancel
                </Button>
                <Button color="indigo" leftSection={<Plus size={16} />}>
                  Create Loan
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={3} size="h4" mb="md">
              Loan Summary
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Borrower
                </Text>
                <Text size="sm" fw={500}>
                  {borrowerProfile.name}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Principal Amount
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.originalLoan}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Interest Rate
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.interestRate}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Interest Amount
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.interest}
                </Text>
              </Group>
            </Stack>

            <Divider my="md" />

            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                Total Payable
              </Text>
              <Text size="lg" fw={700} c="indigo" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {borrowerLoanDetail.totalPayable}
              </Text>
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Start Date
                </Text>
                <Text size="sm" fw={500} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.startedDate}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Due Date
                </Text>
                <Text size="sm" fw={500} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.dueDate}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Loan Term
                </Text>
                <Text size="sm" fw={500}>
                  {borrowerLoanDetail.loanTerm}
                </Text>
              </Group>
            </Stack>

            <Group
              gap="xs"
              mt="lg"
              p="sm"
              wrap="nowrap"
              align="flex-start"
              style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-md)' }}
            >
              <Info size={16} color="var(--mantine-color-gray-6)" style={{ flexShrink: 0, marginTop: 2 }} />
              <Text size="xs" c="dimmed">
                The final loan amount and repayment details will be confirmed when the loan is created.
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

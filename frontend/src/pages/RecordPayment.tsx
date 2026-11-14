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
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { ArrowLeft, Calendar, CircleDollarSign, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { borrowerProfile, borrowers, loans } from '../data/mockData'

const borrowerNames = borrowers.map((borrower) => borrower.name)
const loanSelectData = loans.map((loan) => ({ value: loan.id, label: loan.loanNumber }))
const selectedLoan = loans.find((loan) => loan.id === 'LN-2026-001')!
const dateFormat = 'MMM DD, YYYY'

const paymentPreview = {
  amount: '₱3,000',
  date: 'Oct 01, 2026',
  method: 'Cash',
  remainingBalance: '₱15,000',
}

export default function RecordPayment() {
  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/payments" underline="never" c="dimmed" size="sm">
        <Group gap={4}>
          <ArrowLeft size={14} />
          <span>Back to Payments</span>
        </Group>
      </Anchor>

      <div>
        <Title order={2}>Record Payment</Title>
        <Text size="sm" c="dimmed">
          Record a payment against an active borrower loan.
        </Text>
      </div>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={3} size="h4" mb="md">
              Payment Information
            </Title>
            <Stack gap="md">
              <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Select
                    label="Borrower"
                    placeholder="Select a borrower"
                    description="Select the borrower making the payment."
                    data={borrowerNames}
                    defaultValue={borrowerProfile.name}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Select
                    label="Loan"
                    placeholder="Select a loan"
                    description="Select the loan this payment applies to."
                    data={loanSelectData}
                    defaultValue={selectedLoan.id}
                    renderOption={({ option }) => {
                      const loan = loans.find((candidate) => candidate.id === option.value)
                      return (
                        <Text size="sm">
                          {option.label}
                          {loan ? ` — ${loan.balance} balance` : ''}
                        </Text>
                      )
                    }}
                  />
                </Grid.Col>
              </Grid>

              <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <NumberInput
                    label="Payment Amount"
                    description="Amount being paid against this loan."
                    placeholder="Enter payment amount"
                    defaultValue={3000}
                    prefix="₱"
                    thousandSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Payment Date"
                    leftSection={<Calendar size={16} />}
                    defaultValue={new Date(2026, 9, 1)}
                    valueFormat={dateFormat}
                  />
                </Grid.Col>
              </Grid>

              <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Select
                    label="Payment Method"
                    description="How the borrower paid."
                    data={['Cash', 'Bank Transfer', 'GCash', 'Maya']}
                    defaultValue="Cash"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Reference Number"
                    placeholder="Optional reference number"
                    description="For bank transfers or digital payments."
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Notes"
                description="Optional context visible to other staff."
                placeholder="Add optional payment notes..."
                rows={2}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="default" component={Link} to="/payments">
                  Cancel
                </Button>
                <Button color="indigo" leftSection={<CircleDollarSign size={16} />}>
                  Record Payment
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="lg">
            <Title order={3} size="h4" mb="md">
              Payment Summary
            </Title>
            <Stack gap={2} mb="md">
              <Text fw={600} size="sm">
                {borrowerProfile.name}
              </Text>
              <Text size="xs" c="dimmed">
                {selectedLoan.loanNumber}
              </Text>
            </Stack>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Current Balance
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {selectedLoan.balance}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Payment Amount
                </Text>
                <Text size="sm" fw={500} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {paymentPreview.amount}
                </Text>
              </Group>
            </Stack>

            <Divider my="md" />

            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                Remaining Balance
              </Text>
              <Text size="lg" fw={700} c="indigo" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {paymentPreview.remainingBalance}
              </Text>
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Payment Date
                </Text>
                <Text size="sm" fw={500} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {paymentPreview.date}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Payment Method
                </Text>
                <Text size="sm" fw={500}>
                  {paymentPreview.method}
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
                The loan balance will be updated after this payment is recorded.
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { MessageCircle, Receipt, Send, Sparkles } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { BORROWER_STATUS_BADGE_STYLE } from '../components/borrowers/statusColor'
import { borrowerLoanDetail, borrowerProfile } from '../data/mockData'

const SUGGESTIONS = [
  'How much balance does Maria have?',
  'Who has overdue loans?',
  'Who paid this month?',
  'List loans created this month',
]

export default function Assistant() {
  const [draft, setDraft] = useState('')
  const canSend = draft.trim().length > 0

  // No message-submission handler exists yet (mock conversation only) — sending
  // just clears the composer rather than inventing a new message/response.
  function handleSend() {
    if (!canSend) return
    setDraft('')
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <Stack gap="md" h="100%" style={{ minHeight: 0 }}>
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Group gap="sm" align="flex-start">
          <ThemeIcon variant="light" color="indigo" radius="md" size={40}>
            <Sparkles size={20} />
          </ThemeIcon>
          <div>
            <Title order={2}>A-Loan AI</Title>
            <Text size="sm" c="dimmed">
              Ask questions about borrowers, loans, balances, and payments.
            </Text>
          </div>
        </Group>
        <Badge variant="light" color="indigo" size="md">
          Loan Data Assistant
        </Badge>
      </Group>

      <Stack gap="xs">
        <Text fw={600}>How can I help with your loan portfolio today?</Text>
        <Group gap="xs" wrap="wrap">
          {SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion}
              variant="light"
              color="indigo"
              radius="xl"
              size="xs"
              leftSection={<MessageCircle size={14} />}
            >
              {suggestion}
            </Button>
          ))}
        </Group>
      </Stack>

      <Text size="xs" c="dimmed">
        Answers will be based on A-Loan MS data.
      </Text>

      <Card
        withBorder
        radius="md"
        padding="lg"
        flex={1}
        mih={0}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Stack gap="lg" w="100%" maw={800} mx="auto">
            <Group justify="flex-end" align="flex-end" gap="xs" wrap="nowrap">
              <Paper
                radius="md"
                px="md"
                py="xs"
                style={{ backgroundColor: 'var(--mantine-color-indigo-0)', maxWidth: '80%' }}
              >
                <Text size="sm">How much balance does Maria Santos have?</Text>
              </Paper>
              <Avatar color="indigo" radius="xl" size={28}>
                AC
              </Avatar>
            </Group>

            <Group justify="flex-start" align="flex-end" gap="xs" wrap="nowrap">
              <ThemeIcon variant="light" color="indigo" radius="xl" size={28}>
                <Sparkles size={14} />
              </ThemeIcon>
              <Paper withBorder radius="md" px="md" py="xs" style={{ maxWidth: '80%' }}>
                <Text size="sm">
                  Maria Santos currently has an outstanding balance of ₱18,000 on loan{' '}
                  {borrowerLoanDetail.loanNumber}.
                </Text>
              </Paper>
            </Group>

            <Paper withBorder radius="md" p="md" maw={360} ml={36}>
              <Group gap={6} mb="xs">
                <Receipt size={14} color="var(--mantine-color-indigo-6)" />
                <Text size="xs" fw={600} c="indigo">
                  Loan Snapshot
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" fw={600}>
                  {borrowerProfile.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {borrowerLoanDetail.loanNumber}
                </Text>
              </Group>
              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">
                  Outstanding Balance
                </Text>
                <Text size="xs" fw={600} ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {borrowerLoanDetail.outstandingBalance}
                </Text>
              </Group>
              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">
                  Status
                </Text>
                <Badge style={BORROWER_STATUS_BADGE_STYLE[borrowerLoanDetail.status]} size="sm">
                  {borrowerLoanDetail.status}
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Box>

        <Box w="100%" maw={800} mx="auto" mt="xl" style={{ flexShrink: 0 }}>
          <Box
            pos="relative"
            style={{
              backgroundColor: 'var(--mantine-color-white)',
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-xl)',
            }}
          >
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask about borrowers, loans, or payments..."
              variant="unstyled"
              autosize
              minRows={1}
              maxRows={6}
              styles={{
                input: { paddingRight: 52, paddingLeft: 16, paddingTop: 12, paddingBottom: 12 },
              }}
            />
            <ActionIcon
              color="indigo"
              variant="filled"
              size={36}
              radius="xl"
              aria-label="Send message"
              disabled={!canSend}
              onClick={handleSend}
              pos="absolute"
              bottom={8}
              right={8}
            >
              <Send size={16} />
            </ActionIcon>
          </Box>
        </Box>
      </Card>
    </Stack>
  )
}

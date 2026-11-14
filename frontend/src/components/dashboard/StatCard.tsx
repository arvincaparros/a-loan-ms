import { Group, Paper, Text, ThemeIcon } from '@mantine/core'
import type { LucideIcon } from 'lucide-react'
import { STATUS_TOKENS } from '../../theme'
import type { KpiTrend } from '../../types'

const TREND_COLOR: Record<KpiTrend, string> = {
  up: STATUS_TOKENS.success.color,
  down: STATUS_TOKENS.danger.color,
  warning: STATUS_TOKENS.warning.color,
  neutral: 'dimmed',
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
}: {
  icon: LucideIcon
  label: string
  value: string
  change: string
  trend: KpiTrend
}) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" mb="sm">
        <Text size="sm" c="dimmed" fw={500}>
          {label}
        </Text>
        <ThemeIcon variant="light" color={trend === 'warning' ? 'orange' : 'indigo'} size={34} radius="md">
          <Icon size={18} />
        </ThemeIcon>
      </Group>
      <Text size="xl" fw={700}>
        {value}
      </Text>
      <Text size="xs" c={TREND_COLOR[trend]} mt={4}>
        {change}
      </Text>
    </Paper>
  )
}

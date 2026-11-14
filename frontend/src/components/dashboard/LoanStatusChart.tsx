import { Box, Group, Stack, Text } from '@mantine/core'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { LoanStatusSegment } from '../../types'

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const entry = payload?.[0]
  if (!active || !entry) return null

  return (
    <div
      style={{
        background: 'var(--mantine-color-white)',
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 'var(--mantine-radius-md)',
        padding: '8px 12px',
      }}
    >
      <Text size="sm" fw={600}>
        {entry.name}: {entry.value}
      </Text>
    </div>
  )
}

export function LoanStatusChart({ data }: { data: LoanStatusSegment[] }) {
  const total = data.reduce((sum, segment) => sum + segment.count, 0)

  return (
    <Stack gap="md">
      <Box pos="relative" w="100%" h={200}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              stroke="var(--mantine-color-white)"
              strokeWidth={2}
            >
              {data.map((segment) => (
                <Cell key={segment.status} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip content={ChartTooltip} />
          </PieChart>
        </ResponsiveContainer>
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          style={{ transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}
        >
          <Text fw={700} size="xl" lh={1}>
            {total}
          </Text>
          <Text size="xs" c="dimmed">
            Total Loans
          </Text>
        </Box>
      </Box>

      <Stack gap={6}>
        {data.map((segment) => (
          <Group key={segment.status} justify="space-between">
            <Group gap="xs">
              <Box w={10} h={10} style={{ borderRadius: 999, backgroundColor: segment.color }} />
              <Text size="sm">{segment.status}</Text>
            </Group>
            <Text size="sm" fw={600}>
              {segment.count}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  )
}

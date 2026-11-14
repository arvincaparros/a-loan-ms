import { Text } from '@mantine/core'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { MonthlyCollection } from '../../types'

function formatPeso(value: number) {
  return `₱${value.toLocaleString('en-PH')}`
}

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  const value = payload?.[0]?.value
  if (!active || typeof value !== 'number') return null

  return (
    <div
      style={{
        background: 'var(--mantine-color-white)',
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 'var(--mantine-radius-md)',
        padding: '8px 12px',
      }}
    >
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={600}>
        {formatPeso(value)}
      </Text>
    </div>
  )
}

export function MonthlyCollectionsChart({ data }: { data: MonthlyCollection[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--mantine-color-gray-3)" />
        <XAxis
          dataKey="month"
          axisLine={{ stroke: 'var(--mantine-color-gray-3)' }}
          tickLine={false}
          tick={{ fill: 'var(--mantine-color-gray-6)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--mantine-color-gray-6)', fontSize: 12 }}
          tickFormatter={(value: number) => `₱${value / 1000}k`}
          width={48}
        />
        <Tooltip cursor={{ fill: 'var(--mantine-color-gray-0)' }} content={ChartTooltip} />
        <Bar dataKey="amount" fill="var(--mantine-color-indigo-6)" radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}

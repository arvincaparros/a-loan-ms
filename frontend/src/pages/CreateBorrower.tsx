import { Anchor, Button, Card, Grid, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CreateBorrower() {
  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/borrowers" underline="never" c="dimmed" size="sm">
        <Group gap={4}>
          <ArrowLeft size={14} />
          <span>Back to Borrowers</span>
        </Group>
      </Anchor>

      <div>
        <Title order={2}>Add New Borrower</Title>
        <Text size="sm" c="dimmed">
          Create a borrower profile before assigning a loan.
        </Text>
      </div>

      <Card withBorder radius="md" padding="lg">
        <Title order={3} size="h4" mb="md">
          Borrower Information
        </Title>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            description="The borrower's full legal name."
            placeholder="Enter borrower's full name"
          />

          <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email Address"
                description="Used for payment reminders and notices."
                placeholder="Enter email address"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Phone Number"
                description="Primary contact number for this borrower."
                placeholder="Enter phone number"
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Address"
            description="Borrower's complete mailing address."
            placeholder="Enter complete address"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" component={Link} to="/borrowers">
              Cancel
            </Button>
            <Button color="indigo" leftSection={<UserPlus size={16} />}>
              Add Borrower
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}

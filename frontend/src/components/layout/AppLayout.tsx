import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  CreditCard,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const NAVBAR_BACKGROUND = '#101828'

const NAV_ITEMS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Borrowers', to: '/borrowers', icon: Users },
  { label: 'Loans', to: '/loans', icon: HandCoins },
  { label: 'Payments', to: '/payments', icon: CreditCard },
]

function isNavItemActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Dashboard'
  if (pathname === '/borrowers') return 'Borrowers'
  if (pathname === '/borrowers/new') return 'Add Borrower'
  if (pathname.startsWith('/borrowers/')) return 'Borrower Details'
  if (pathname === '/loans') return 'Loans'
  if (pathname === '/loans/new') return 'Create Loan'
  if (pathname === '/payments') return 'Payments'
  if (pathname === '/payments/new') return 'Record Payment'
  if (pathname === '/assistant') return 'Ask AI'
  return 'A-Loan MS'
}

function SidebarNavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string
  label: string
  icon: LucideIcon
  active: boolean
}) {
  return (
    <Link to={to} className="sidebar-link" data-active={active ? 'true' : undefined}>
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  )
}

export function AppLayout() {
  const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure()
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)
  const isAssistantActive = location.pathname === '/assistant'

  return (
    <AppShell
      layout="alt"
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !navbarOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={navbarOpened}
              onClick={toggleNavbar}
              hiddenFrom="sm"
              size="sm"
              aria-label={navbarOpened ? 'Close navigation menu' : 'Open navigation menu'}
            />
            <Title order={4} fw={600}>
              {pageTitle}
            </Title>
          </Group>

          <Group gap="md">
            <Text size="sm" c="dimmed">
              October 2026
            </Text>
            <Divider orientation="vertical" />
            <Group gap="xs">
              <Avatar color="indigo" radius="xl" size={36}>
                AC
              </Avatar>
              <div>
                <Text size="sm" fw={600} lh={1.2}>
                  Arvin Caparros
                </Text>
                <Text size="xs" c="dimmed" lh={1.2}>
                  Administrator
                </Text>
              </div>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      {/* In layout="alt", the navbar spans full height and is stacked above the header
          (navbar z-index = zIndex + 1) by default, so on mobile the open drawer covers
          the header — including the burger toggle used to close it. Pin the navbar's
          z-index just below the header's so the header (and the toggle) stay on top;
          desktop is unaffected since the two regions never overlap there. */}
      <AppShell.Navbar zIndex={98} withBorder={false} style={{ backgroundColor: NAVBAR_BACKGROUND }}>
        <AppShell.Section p="md">
          <Group gap="sm">
            <ThemeIcon size={36} radius="md" variant="light" color="indigo">
              <Landmark size={20} />
            </ThemeIcon>
            <div>
              <Text c="white" fw={700} size="sm" lh={1.2}>
                A-Loan MS
              </Text>
              <Text c="gray.5" size="xs" lh={1.2}>
                AI Loan Management
              </Text>
            </div>
          </Group>
        </AppShell.Section>

        <AppShell.Section grow p="md" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <SidebarNavLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              active={isNavItemActive(location.pathname, item.to)}
            />
          ))}
        </AppShell.Section>

        <AppShell.Section p="md">
          <Button
            variant={isAssistantActive ? 'filled' : 'light'}
            color="indigo"
            fullWidth
            radius="md"
            justify="flex-start"
            leftSection={<Sparkles size={16} />}
            component={Link}
            to="/assistant"
          >
            Ask AI
          </Button>
          <Text c="gray.6" size="xs" ta="center" mt="sm">
            A-Loan MS v1.0
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Ask AI needs a bounded-height layout (fill viewport, scroll messages internally,
          composer anchored) instead of the normal page-grows-and-scrolls behavior every
          other route uses. AppShell.Main only sets min-height by default, which doesn't
          give a descendant's flex={1} anything to resolve against, so the height chain has
          to start here. Scoped to the assistant route only — every other page's rendered
          styles are unchanged. */}
      <AppShell.Main
        style={{
          backgroundColor: 'var(--mantine-color-gray-0)',
          ...(isAssistantActive && { height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }),
        }}
      >
        {/* AppShell.Main already adds its own top padding (header offset + the AppShell's
            padding="md") — this wrapper's old py="md" stacked an extra 16px on top of that,
            pushing the header-to-heading gap to 32px. pt is trimmed to close that redundant
            gap down to ~24px; pb is left at the original "md" since bottom spacing wasn't
            part of the complaint. */}
        <Box
          maw={1200}
          mx="auto"
          pt={8}
          pb="md"
          style={
            isAssistantActive
              ? { width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }
              : undefined
          }
        >
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

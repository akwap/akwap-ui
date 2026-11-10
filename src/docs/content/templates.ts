import type { Block, DocPage, DocPages } from './types'

/** Every template page: live preview of the real route, what it uses, and where it lives. */
function template(o: { title: string; lead: string; route: string; file: string; uses: string[]; notes: string[]; height?: number }): DocPage {
  const blocks: Block[] = [
    { t: 'preview', to: o.route, title: o.title, height: o.height },
    { t: 'h2', id: 'uses', text: 'Built with' },
    { t: 'p', text: o.uses.map((u) => `\`${u}\``).join(', ') },
    { t: 'h2', id: 'source', text: 'Source' },
    { t: 'p', text: `\`${o.file}\`. Copy the file into your app and replace the mock services with your API.` },
    { t: 'h2', id: 'notes', text: 'What to notice' },
    { t: 'list', items: o.notes },
  ]
  return { title: o.title, lead: o.lead, blocks }
}

export const templates: DocPages = {
  login: template({
    title: 'Login page',
    lead: 'Split auth layout with a sign-in form, social sign-in, remember me and inline server errors.',
    route: '/auth/login',
    file: 'src/pages/auth/LoginPage.vue',
    uses: ['AuthLayout', 'AkField', 'AkInput', 'AkCheckbox', 'AkButton', 'AkAlert', 'AkDivider', 'useForm', 'useToast'],
    notes: ['Errors appear on blur and focus moves to the first invalid field on submit.', 'Wrong credentials show an alert that does not reveal whether the account exists.', 'The brand panel hides below 1024px so the form gets the full width.'],
  }),
  registration: template({
    title: 'Registration page',
    lead: 'Account creation with a live password-strength meter, confirmation matching and terms acceptance.',
    route: '/auth/register',
    file: 'src/pages/auth/RegisterPage.vue',
    uses: ['AkField', 'AkInput', 'AkPasswordStrength', 'AkCheckbox', 'AkButton', 'AkAlert', 'useForm', 'rules.strongPassword', 'rules.matches'],
    notes: ['The confirmation field re-validates as the password changes.', 'Strength checks are announced politely and listed as met / not met.', 'Use `taken@akwap.example` to see a server-side duplicate-email error.'],
    height: 760,
  }),
  homepage: template({
    title: 'Marketing homepage',
    lead: 'Landing page with hero, social proof, feature grid, product preview, pricing with a billing toggle, testimonials, FAQ and call to action.',
    route: '/',
    file: 'src/pages/marketing/HomePage.vue',
    uses: ['MarketingLayout', 'AkButton', 'AkCard', 'AkBadge', 'AkSegmentedControl', 'AkAccordion', 'AkStatCard', 'AkLineChart', 'AkAvatar', 'AkDialog'],
    notes: ['The display heading uses the fluid `text-display` style.', 'Monthly / yearly pricing is a segmented control, not tabs, because it filters one view.', 'The header becomes a drawer menu below 768px.'],
    height: 760,
  }),
  profile: template({
    title: 'User profile',
    lead: 'Profile header with avatar and role, and tabs for personal information, security, notifications and recent activity.',
    route: '/account/profile',
    file: 'src/pages/account/ProfilePage.vue',
    uses: ['DashboardLayout', 'PageHeader', 'SettingsRow', 'AkTabs', 'AkCard', 'AkAvatar', 'AkField', 'AkInput', 'AkSelect', 'AkSwitch', 'AkPasswordStrength', 'AkDialog', 'AkDescriptionList', 'AkTimeline'],
    notes: ['Each tab is a separate form with its own save action.', 'Settings rows stack label above control on phones.'],
  }),
  dashboard: template({
    title: 'Dashboard overview',
    lead: 'The app shell with KPI cards, revenue and growth charts, recent transactions and an activity feed.',
    route: '/dashboard',
    file: 'src/pages/dashboard/OverviewPage.vue',
    uses: ['DashboardLayout', 'AkStatCard', 'AkChartCard', 'AkLineChart', 'AkBarChart', 'AkDonutChart', 'AkDataTable', 'AkActivityFeed', 'AkSegmentedControl'],
    notes: ['Try Ctrl + K for the command palette and [ to collapse the sidebar.', 'KPIs reflow from four columns to one.', 'Every chart has a text summary and a hidden data table.'],
    height: 760,
  }),
  'user-management': template({
    title: 'User management',
    lead: 'Searchable, filterable user table with bulk actions, add/edit dialog, detail drawer, delete confirmation, pagination and CSV export.',
    route: '/dashboard/users',
    file: 'src/pages/users/UserManagementPage.vue',
    uses: ['PageHeader', 'AkDataTable', 'AkPagination', 'AkInput', 'AkMultiSelect', 'AkSelect', 'AkDialog', 'AkDrawer', 'AkConfirmDialog', 'AkMenu', 'AkAvatar', 'AkStatusIndicator', 'AkDescriptionList', 'useForm', 'downloadCsv'],
    notes: ['Selecting rows reveals a bulk action bar with a count.', 'Deleting asks for confirmation and names who will be removed.', 'Only Owner, Admin and Manager roles can open this page; switch role from the profile menu to see the guard.'],
    height: 760,
  }),
  analytics: template({
    title: 'Analytics',
    lead: 'Date range and view controls, KPI cards, trend and comparison charts, a breakdown table and an export dialog.',
    route: '/dashboard/analytics',
    file: 'src/pages/analytics/AnalyticsPage.vue',
    uses: ['AkDateRangePicker', 'AkSegmentedControl', 'AkStatCard', 'AkChartCard', 'AkLineChart', 'AkBarChart', 'AkDataTable', 'AkProgressBar', 'AkDialog', 'AkRadioGroup', 'AkCheckbox'],
    notes: ['Series colours stay with the entity when the view changes.', 'The export dialog is reachable directly at `?export=1`.'],
    height: 760,
  }),
}

import type { DocPages } from './types'

export const patterns: DocPages = {
  authentication: {
    title: 'Authentication',
    lead: 'Sign-in, registration, password recovery and email verification share one layout, large controls and the same validation behaviour.',
    blocks: [
      { t: 'h2', id: 'flows', text: 'Flows' },
      { t: 'links', items: [
        { label: 'Sign in', to: '/auth/login', description: 'Email, password, remember me, SSO buttons and server errors.' },
        { label: 'Create account', to: '/auth/register', description: 'Password strength meter, confirmation and terms.' },
        { label: 'Forgot password', to: '/auth/forgot-password', description: 'Request a reset link; neutral confirmation message.' },
        { label: 'Reset password', to: '/auth/reset-password?token=demo', description: 'New password with strength and match checks.' },
        { label: 'Verify email', to: '/auth/verify-email', description: 'Pending, verified and expired states with a 30-second resend cooldown.' },
      ] },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: [
        'Use `size="lg"` controls and a block primary button.',
        'Set `autocomplete` (`email`, `current-password`, `new-password`) so password managers and autofill work.',
        'Show server errors in an `AkAlert` above the form, with a message that does not reveal whether an account exists.',
        'Never disable paste in password fields; offer a show/hide toggle instead.',
        'After success, confirm with a toast and move on; do not leave people on a dead-end page.',
      ] },
      { t: 'callout', intent: 'info', text: 'Demo password: `Akwap!2026`. Try `locked@akwap.example` to see the locked-account error.' },
    ],
  },
  'dashboard-layouts': {
    title: 'Dashboard layouts',
    lead: 'The dashboard shell combines a responsive sidebar, a top bar with search, notifications and profile, breadcrumbs and a content area with a page header.',
    blocks: [
      { t: 'h2', id: 'shell', text: 'The app shell' },
      { t: 'table', caption: 'Shell behaviour by width', head: ['Width', 'Sidebar', 'Top bar'], rows: [
        ['< 768px', 'Hidden; opens as a drawer from the menu button', 'Logo, search icon, notifications, profile'],
        ['768–1279px', 'Icon rail with tooltips and flyouts', 'Breadcrumbs appear'],
        ['≥ 1280px', 'Full sidebar; can be collapsed (remembered)', 'Search box with Ctrl + K hint'],
      ] },
      { t: 'h2', id: 'shortcuts', text: 'Keyboard shortcuts' },
      { t: 'table', caption: 'Dashboard shortcuts', head: ['Keys', 'Action'], rows: [['`Ctrl` / `⌘` + `K` or `/`', 'Open the command palette'], ['`[`', 'Collapse or expand the sidebar'], ['`Shift` + `D`', 'Toggle dark theme'], ['`?`', 'Show all shortcuts']] },
      { t: 'h2', id: 'page', text: 'Page structure' },
      { t: 'code', code: `<PageHeader title="Analytics" description="Revenue, users and engagement">
  <template #actions>
    <AkDateRangePicker v-model="range" />
    <AkButton variant="primary" :icon="Download">Export</AkButton>
  </template>
</PageHeader>

<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <AkStatCard v-for="k in kpis" :key="k.label" v-bind="k" />
</section>` },
      { t: 'list', items: ['Lead with KPIs, then trends, then detail tables.', 'Keep page actions in the page header; row actions in row menus.', 'Role-restricted pages show an explanation and a way back, not a blank screen.'] },
      { t: 'links', items: [{ label: 'Overview page', to: '/dashboard', description: 'KPIs, charts, recent transactions and activity.' }, { label: 'Analytics page', to: '/dashboard/analytics', description: 'Date ranges, segmented views and export.' }] },
    ],
  },
  'data-tables': {
    title: 'Data tables',
    lead: 'Tables let people scan, compare and act on records. Combine AkDataTable with search, filters, bulk actions and pagination.',
    blocks: [
      { t: 'example', file: 'table/Sortable', title: 'Sortable, selectable table' },
      { t: 'h2', id: 'anatomy', text: 'A complete table view' },
      { t: 'list', ordered: true, items: ['Toolbar: search, filters and the primary action (“Add user”).', 'Bulk action bar: replaces the toolbar while rows are selected, with a count and actions.', 'Table: identifying column first, numbers right-aligned, a row menu at the end.', 'Footer: pagination with total count and page size.'] },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: ['Hide secondary columns with `hideBelow` before resorting to horizontal scroll.', 'Destructive bulk actions need a confirmation dialog that states how many items are affected.', 'Keep selection when sorting; clear it after a bulk action completes.', 'Offer CSV export for any table people may need outside the app.'] },
      { t: 'links', items: [{ label: 'User management', to: '/dashboard/users', description: 'Full example with filters, bulk actions, dialogs, drawer and export.' }, { label: 'Activity logs', to: '/dashboard/activity', description: 'Read-only log table with type and date filters.' }] },
    ],
  },
  'search-filtering': {
    title: 'Search and filtering',
    lead: 'Search narrows by text; filters narrow by attributes. Results update as you type and always say how many matched.',
    blocks: [
      { t: 'example', file: 'patterns/SearchFilter', title: 'Live search with role filter' },
      { t: 'list', items: ['Put search first, then the most-used filters inline; move the rest into a filter drawer on small screens.', 'Announce the result count in a status region.', 'Show active filters and a single “Clear filters” action.', 'Empty results use the search empty state and repeat the query.', 'Reflect search and filters in the URL when the view should be shareable.'] },
    ],
  },
  forms: {
    title: 'Forms',
    lead: 'Forms use AkField for structure and useForm for validation: validate on blur, then live while fixing; on submit, show a summary and focus the first error.',
    blocks: [
      { t: 'example', file: 'form/ValidatedForm', title: 'Validated form' },
      { t: 'h2', id: 'messages', text: 'Writing error messages' },
      { t: 'table', caption: 'Error message examples', head: ['Instead of', 'Write'], rows: [['Invalid input', 'Enter a valid email address, like name@company.com'], ['Required', 'Enter your full name'], ['Password too weak', 'Use at least 8 characters with a number and a symbol']] },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: ['Keep the submit button enabled; validate when it is pressed.', 'Mark required fields with an asterisk, or optional ones with “(optional)” when most are required.', 'Preserve input on errors and after a failed request.', 'Use `novalidate` on the form so AkwapUI messages replace browser bubbles.'] },
    ],
  },
  'user-profiles': {
    title: 'User profiles',
    lead: 'Profiles present identity, editable details, security settings and recent activity in tabs.',
    blocks: [
      { t: 'links', items: [{ label: 'Profile page', to: '/account/profile', description: 'Avatar, details form, password change, sessions and activity.' }, { label: 'Account settings', to: '/account/settings', description: 'Preferences, appearance, notifications and active sessions.' }] },
      { t: 'list', items: ['Show the person’s name, role and status at the top with an avatar.', 'Use tabs for Personal information, Security, Notifications and Activity.', 'Group settings in rows: label and description on the left, control on the right (stacks on mobile).', 'Confirm actions that affect other devices or data (signing out sessions) with an alert dialog that names what will happen.'] },
    ],
  },
  notifications: {
    title: 'Notifications',
    lead: 'Use the lightest pattern that fits: toasts for confirmations, alerts for persistent page messages, the notification centre for events people may act on later.',
    blocks: [
      { t: 'table', caption: 'Choosing a notification pattern', head: ['Pattern', 'Use for', 'Persistence'], rows: [
        ['Toast', 'Confirmations, background completions, undo', 'Auto-dismisses after 5s; pauses on hover/focus'],
        ['Alert', 'Errors, warnings and page-level information', 'Until resolved or dismissed'],
        ['Notification centre', 'Mentions, billing and security events', 'Until read; filter by type and read status'],
        ['Badge', 'Counts on navigation', 'Live'],
      ] },
      { t: 'example', file: 'toast/Basic', title: 'Toasts' },
      { t: 'links', items: [{ label: 'Notifications page', to: '/dashboard/notifications', description: 'Filter by type and read status, mark all as read.' }] },
    ],
  },
  'error-handling': {
    title: 'Error handling',
    lead: 'Errors explain what happened, reassure, and offer a way forward. Match the error to the scope of the problem.',
    blocks: [
      { t: 'example', file: 'patterns/ErrorRetry', title: 'Component-level error with retry', description: 'The first retry fails, the second succeeds.' },
      { t: 'table', caption: 'Error scopes', head: ['Scope', 'Pattern'], rows: [['Field', 'Inline message under the field (AkField `error`)'], ['Form', 'Alert above the form plus focus on the first invalid field'], ['Widget', 'Error empty state inside the card with a retry button'], ['Page', 'Full-page empty state, e.g. the [404 page](/this-page-does-not-exist)'], ['Background task', 'Error toast with an action']] },
      { t: 'list', items: ['Say what happened in plain language; avoid codes unless they help support.', 'Keep the user’s work; never clear a form on error.', 'Offer one clear next step: retry, go back, or contact support.'] },
    ],
  },
}

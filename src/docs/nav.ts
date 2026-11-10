/** Documentation navigation — single source of truth for the sidebar, search and routes. */
export interface DocLink {
  label: string
  slug: string
}
export interface DocSection {
  id: 'introduction' | 'foundations' | 'components' | 'patterns' | 'templates' | 'resources'
  title: string
  links: DocLink[]
}

export const docSections: DocSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    links: [
      { label: 'Overview', slug: 'overview' },
      { label: 'Design principles', slug: 'principles' },
      { label: 'Installation', slug: 'installation' },
      { label: 'Getting started', slug: 'getting-started' },
      { label: 'Project architecture', slug: 'architecture' },
    ],
  },
  {
    id: 'foundations',
    title: 'Foundations',
    links: [
      { label: 'Colors', slug: 'colors' },
      { label: 'Typography', slug: 'typography' },
      { label: 'Spacing', slug: 'spacing' },
      { label: 'Grid system', slug: 'grid' },
      { label: 'Border radius', slug: 'radius' },
      { label: 'Elevation', slug: 'elevation' },
      { label: 'Icons', slug: 'icons' },
      { label: 'Motion', slug: 'motion' },
      { label: 'Accessibility', slug: 'accessibility' },
      { label: 'Responsive design', slug: 'responsive' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    links: [
      { label: 'Buttons', slug: 'button' },
      { label: 'Inputs', slug: 'input' },
      { label: 'Forms', slug: 'form' },
      { label: 'Selects', slug: 'select' },
      { label: 'Checkboxes', slug: 'checkbox' },
      { label: 'Radio buttons', slug: 'radio' },
      { label: 'Switches', slug: 'switch' },
      { label: 'Date & time pickers', slug: 'date-time' },
      { label: 'File upload', slug: 'file-upload' },
      { label: 'Cards', slug: 'card' },
      { label: 'Tables', slug: 'table' },
      { label: 'Badges', slug: 'badge' },
      { label: 'Avatars', slug: 'avatar' },
      { label: 'Alerts', slug: 'alert' },
      { label: 'Toasts', slug: 'toast' },
      { label: 'Modals', slug: 'modal' },
      { label: 'Drawers', slug: 'drawer' },
      { label: 'Navigation', slug: 'navigation' },
      { label: 'Tabs', slug: 'tabs' },
      { label: 'Dropdowns', slug: 'dropdown' },
      { label: 'Tooltips & popovers', slug: 'tooltip' },
      { label: 'Pagination', slug: 'pagination' },
      { label: 'Progress indicators', slug: 'progress' },
      { label: 'Empty states', slug: 'empty-state' },
      { label: 'Charts', slug: 'charts' },
      { label: 'Disclosure & lists', slug: 'disclosure' },
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    links: [
      { label: 'Authentication', slug: 'authentication' },
      { label: 'Dashboard layouts', slug: 'dashboard-layouts' },
      { label: 'Data tables', slug: 'data-tables' },
      { label: 'Search and filtering', slug: 'search-filtering' },
      { label: 'Forms', slug: 'forms' },
      { label: 'User profiles', slug: 'user-profiles' },
      { label: 'Notifications', slug: 'notifications' },
      { label: 'Error handling', slug: 'error-handling' },
    ],
  },
  {
    id: 'templates',
    title: 'Templates',
    links: [
      { label: 'Login', slug: 'login' },
      { label: 'Registration', slug: 'registration' },
      { label: 'Homepage', slug: 'homepage' },
      { label: 'Profile', slug: 'profile' },
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'User management', slug: 'user-management' },
      { label: 'Analytics', slug: 'analytics' },
    ],
  },
  {
    id: 'resources',
    title: 'Developer resources',
    links: [
      { label: 'Installation', slug: 'installation' },
      { label: 'Configuration', slug: 'configuration' },
      { label: 'Theming', slug: 'theming' },
      { label: 'Component API', slug: 'component-api' },
      { label: 'Customization', slug: 'customization' },
      { label: 'Best practices', slug: 'best-practices' },
      { label: 'Migration guide', slug: 'migration' },
      { label: 'Testing', slug: 'testing' },
      { label: 'FAQ', slug: 'faq' },
    ],
  },
]

export const docHref = (section: string, slug: string) => `/docs/${section}/${slug}`

/** Flat, ordered list for prev/next links and search. */
export const flatDocs = docSections.flatMap((s) => s.links.map((l) => ({ ...l, section: s.id, sectionTitle: s.title, href: docHref(s.id, l.slug) })))

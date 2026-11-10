import { Wallet, Users, ChartLine, ShieldCheck, Smartphone, Plug, Building2, Receipt, Store } from '@lucide/vue'

export const features = [
  { icon: Wallet, title: 'Collections & billing', body: 'Invoice, collect and reconcile across cards, bank transfer and mobile money in one ledger.' },
  { icon: Users, title: 'Members & customers', body: 'A single record for every customer or member, with roles, limits and full history.' },
  { icon: ChartLine, title: 'Real-time analytics', body: 'Revenue, growth and performance dashboards that update as transactions land.' },
  { icon: ShieldCheck, title: 'Security & audit', body: 'Two-factor sign-in, granular roles and an immutable activity log for every change.' },
  { icon: Smartphone, title: 'Works on any device', body: 'Responsive by default, so branch staff can work from a phone, tablet or desktop.' },
  { icon: Plug, title: 'Open integrations', body: 'Connect accounting, SMS and payment providers with webhooks and a REST API.' },
]

export const industries = [
  { icon: Building2, label: 'SACCOs & microfinance' },
  { icon: Receipt, label: 'ISP & utility billing' },
  { icon: Store, label: 'Retail & POS' },
]

export const testimonials = [
  { quote: 'We closed month-end in two days instead of nine. Our tellers picked it up in an afternoon.', name: 'Wanjiru Kimani', role: 'Finance Director, Sunrise SACCO' },
  { quote: 'Billing 40,000 subscribers used to mean three tools and a spreadsheet. Now it is one screen.', name: 'Tendai Moyo', role: 'COO, Mvuli Fibre' },
  { quote: 'The audit log alone paid for itself during our regulator review last quarter.', name: 'Kemi Adeyemi', role: 'Head of Compliance, Baraka Health' },
]

export const plans = [
  { name: 'Starter', monthly: 29, annual: 24, description: 'For small teams getting organised.', features: ['Up to 5 users', '1 branch', 'Collections & invoicing', 'Email support'], cta: 'Start free trial' },
  { name: 'Business', monthly: 79, annual: 66, description: 'For growing organisations with multiple branches.', features: ['Up to 60 users', 'Unlimited branches', 'Analytics & exports', 'Roles & audit log', 'Priority support'], cta: 'Start free trial', featured: true },
  { name: 'Enterprise', monthly: null, annual: null, description: 'For regulated and high-volume operations.', features: ['Unlimited users', 'SSO & SCIM', 'Dedicated environment', '99.95% uptime SLA', 'Named success manager'], cta: 'Talk to sales' },
]

export const faqs = [
  { q: 'Is there a free trial?', a: 'Yes. Every plan starts with a 14-day free trial with all Business features. No credit card is required.' },
  { q: 'Which payment methods can we collect?', a: 'Cards, bank transfers, cash with receipts, and the major mobile money networks. You can enable or disable each per branch.' },
  { q: 'Can we import our existing customers?', a: 'Upload a CSV or Excel file and map the columns. Our team will help with migrations from other systems on Business and Enterprise.' },
  { q: 'Where is our data stored?', a: 'In-region data centres with encryption at rest and in transit. Enterprise customers can choose a dedicated environment.' },
  { q: 'Can we change plans later?', a: 'Upgrade or downgrade at any time. Changes are prorated to the day.' },
]

export const stats = [
  { value: '2,400+', label: 'organisations' },
  { value: '$1.2B', label: 'processed in 2025' },
  { value: '14', label: 'countries' },
  { value: '99.98%', label: 'uptime last 12 months' },
]

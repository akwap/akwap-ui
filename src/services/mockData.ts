/**
 * Deterministic mock data shared by every example page so that numbers,
 * people and records agree across the dashboard, users, analytics,
 * notifications and logs.
 */
import type { ActivityLog, AppNotification, Role, Transaction, User, UserStatus } from '@/types'

// Seeded PRNG so data is stable between reloads and in tests.
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const rand = rng(42)
const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!

export const TODAY = '2026-11-10'
export const NOW = '2026-11-10T09:00:00Z'

export const currentUser = {
  id: 1,
  name: 'Amina Okafor',
  email: 'amina.okafor@akwap.example',
  phone: '+254 712 345 678',
  role: 'Admin' as Role,
  status: 'active' as UserStatus,
  department: 'Operations',
  title: 'Head of Operations',
  location: 'Nairobi, Kenya',
  timezone: 'Africa/Nairobi',
  language: 'English (UK)',
  joined: '2023-02-14',
  lastPasswordChange: '2026-08-02',
  twoFactor: true,
}

export const organization = { name: 'Akwap Cloud', plan: 'Business', seats: 60 }

const first = ['Amina', 'Brian', 'Chloe', 'Daniel', 'Esther', 'Farid', 'Grace', 'Hassan', 'Ivy', 'James', 'Kemi', 'Liam', 'Mercy', 'Nikhil', 'Olivia', 'Peter', 'Qing', 'Rosa', 'Samuel', 'Tendai', 'Uma', 'Victor', 'Wanjiru', 'Xavier', 'Yusuf', 'Zara']
const last = ['Okafor', 'Mwangi', 'Bennett', 'Kariuki', 'Nakamura', 'Haddad', 'Achieng', 'Ali', 'Chen', 'Otieno', 'Adeyemi', 'Murphy', 'Wambui', 'Patel', 'Garcia', 'Kamau', 'Li', 'Santos', 'Owusu', 'Moyo', 'Rao', 'Njoroge', 'Kimani', 'Dubois', 'Ibrahim', 'Mensah']
const departments = ['Operations', 'Finance', 'Sales', 'Support', 'Engineering', 'Marketing']
const locations = ['Nairobi, Kenya', 'Lagos, Nigeria', 'Kampala, Uganda', 'London, UK', 'Accra, Ghana', 'Kigali, Rwanda', 'Dar es Salaam, Tanzania']
const roles: Role[] = ['Admin', 'Manager', 'Analyst', 'Member', 'Member', 'Member', 'Manager']
const statuses: UserStatus[] = ['active', 'active', 'active', 'active', 'inactive', 'pending', 'suspended']

function isoDaysAgo(days: number, hour = 9) {
  const d = new Date(`${TODAY}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  // Keep 'today' entries in the past relative to NOW (09:00Z).
  d.setUTCHours(days === 0 ? Math.min(hour, 8) : hour, Math.floor(rand() * 60))
  return d.toISOString()
}

export const users: User[] = Array.from({ length: 48 }, (_, i) => {
  if (i === 0)
    return {
      id: 1,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      role: 'Owner',
      status: 'active',
      department: currentUser.department,
      lastActive: isoDaysAgo(0, 8),
      joined: currentUser.joined,
      location: currentUser.location,
    }
  const f = first[(i * 7) % first.length]!
  const l = last[(i * 11 + 5 * Math.floor(i / first.length)) % last.length]!
  return {
    id: i + 1,
    name: `${f} ${l}`,
    email: `${f}.${l}`.toLowerCase() + '@akwap.example',
    phone: `+254 7${String(10 + ((i * 37) % 89)).padStart(2, '0')} ${String(100 + ((i * 113) % 899))} ${String(100 + ((i * 271) % 899))}`,
    role: pick(roles),
    status: pick(statuses),
    department: pick(departments),
    lastActive: isoDaysAgo(Math.floor(rand() * 30), 6 + Math.floor(rand() * 12)),
    joined: isoDaysAgo(60 + Math.floor(rand() * 900)).slice(0, 10),
    location: pick(locations),
  }
})

const customers = ['Kilimo Traders', 'Baraka Pharmacy', 'Sunrise SACCO', 'Mvuli Hardware', 'Jua Kali Motors', 'Bahari Foods', 'Tausi Fashion', 'Ndovu Logistics', 'Upendo Clinic', 'Simba Electronics', 'Zuri Salon', 'Pwani Fresh']
const methods: Transaction['method'][] = ['Card', 'Mobile money', 'Mobile money', 'Bank transfer', 'Cash']
const tStatus: Transaction['status'][] = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed', 'refunded']

export const transactions: Transaction[] = Array.from({ length: 36 }, (_, i) => {
  const c = customers[i % customers.length]!
  return {
    id: `TXN-${(48210 - i).toString()}`,
    customer: c,
    email: `billing@${c.toLowerCase().replace(/\W+/g, '')}.example`,
    amount: Math.round((80 + rand() * 4200) * 100) / 100,
    method: pick(methods),
    status: pick(tStatus),
    date: isoDaysAgo(Math.floor(i / 3), 7 + (i % 11)),
  }
})

export const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
export const revenueByMonth = [182, 176, 194, 201, 215, 209, 232, 248, 241, 263, 279, 296].map((n) => n * 1000)
export const revenuePrevYear = [151, 149, 160, 171, 178, 183, 190, 202, 207, 214, 226, 240].map((n) => n * 1000)
export const userGrowth = [2140, 2210, 2290, 2380, 2490, 2560, 2690, 2810, 2900, 3050, 3180, 3342]
export const activeUsers = [1610, 1650, 1710, 1790, 1870, 1900, 2010, 2120, 2170, 2290, 2400, 2508]
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const transactionsByDay = {
  card: [412, 456, 431, 489, 520, 301, 244],
  mobile: [612, 640, 598, 702, 744, 512, 430],
}
export const paymentMix = [
  { label: 'Mobile money', value: 48 },
  { label: 'Card', value: 31 },
  { label: 'Bank transfer', value: 15 },
  { label: 'Cash', value: 6 },
]

export const kpis = {
  revenue: { value: 296_420, delta: 6.1, trend: revenueByMonth.slice(-8) },
  customers: { value: 3342, delta: 5.1, trend: userGrowth.slice(-8) },
  transactions: { value: 18_904, delta: -2.4, trend: [2410, 2520, 2480, 2390, 2440, 2380, 2350, 2299] },
  churn: { value: 1.8, delta: -0.4, trend: [2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 1.9, 1.8] },
}

export const notifications: AppNotification[] = [
  { id: 1, kind: 'security', title: 'New sign-in from Chrome on Windows', body: 'We noticed a sign-in to your account from Nairobi, Kenya. If this was you, no action is needed.', time: isoDaysAgo(0, 8), read: false, link: '/account/settings' },
  { id: 2, kind: 'billing', title: 'Invoice INV-2026-1104 is ready', body: 'Your November invoice of $1,240.00 is available to download.', time: isoDaysAgo(0, 7), read: false, link: '/dashboard/settings' },
  { id: 3, kind: 'mention', title: 'Brian Mwangi mentioned you', body: '“@Amina can you approve the Sunrise SACCO limit increase before Friday?”', time: isoDaysAgo(1, 15), read: false, actor: 'Brian Mwangi', link: '/dashboard/activity' },
  { id: 4, kind: 'team', title: 'Grace Achieng joined the Finance team', body: 'Grace accepted your invitation and now has Analyst access.', time: isoDaysAgo(1, 10), read: true, actor: 'Grace Achieng', link: '/dashboard/users' },
  { id: 5, kind: 'system', title: 'Scheduled maintenance on Nov 15', body: 'Billing exports will be unavailable from 02:00 to 03:00 EAT.', time: isoDaysAgo(2, 12), read: true },
  { id: 6, kind: 'billing', title: 'Payment failed for Jua Kali Motors', body: 'TXN-48193 was declined by the issuing bank. Retry scheduled automatically.', time: isoDaysAgo(3, 9), read: false, link: '/dashboard' },
  { id: 7, kind: 'security', title: 'Two-factor authentication enabled', body: 'Kemi Adeyemi turned on two-factor authentication.', time: isoDaysAgo(4, 14), read: true, actor: 'Kemi Adeyemi' },
  { id: 8, kind: 'team', title: 'Role changed for Hassan Ali', body: 'Hassan Ali was changed from Member to Manager by Amina Okafor.', time: isoDaysAgo(6, 11), read: true, actor: 'Amina Okafor', link: '/dashboard/users' },
  { id: 9, kind: 'system', title: 'Export complete', body: 'Your “Q3 transactions” CSV export (12,480 rows) is ready.', time: isoDaysAgo(8, 16), read: true, link: '/dashboard/analytics' },
]

const actions: { action: string; type: ActivityLog['type']; target: string }[] = [
  { action: 'Signed in', type: 'auth', target: 'Web app' },
  { action: 'Signed out', type: 'auth', target: 'Web app' },
  { action: 'Created customer', type: 'create', target: 'Bahari Foods' },
  { action: 'Updated role', type: 'update', target: 'Hassan Ali' },
  { action: 'Deleted draft invoice', type: 'delete', target: 'INV-2026-0988' },
  { action: 'Exported report', type: 'export', target: 'Monthly revenue' },
  { action: 'Changed setting', type: 'settings', target: 'Session timeout' },
  { action: 'Failed sign-in attempt', type: 'auth', target: 'Web app' },
  { action: 'Issued refund', type: 'update', target: 'TXN-48177' },
  { action: 'Invited user', type: 'create', target: 'grace.achieng@akwap.example' },
]
const devices = ['Chrome · Windows', 'Safari · macOS', 'Edge · Windows', 'Firefox · Ubuntu', 'Safari · iOS', 'Chrome · Android']

export const activityLogs: ActivityLog[] = Array.from({ length: 64 }, (_, i) => {
  const u = users[(i * 5) % 12]!
  const a = actions[(i * 3) % actions.length]!
  return {
    id: 9000 - i,
    user: u.name,
    email: u.email,
    ...a,
    ip: `102.${(i * 17) % 255}.${(i * 29) % 255}.${(i * 41) % 255}`,
    time: isoDaysAgo(Math.floor(i / 4), 18 - (i % 10)),
    device: devices[i % devices.length]!,
  }
})

export const recentActivity = activityLogs.slice(0, 6).map((l) => ({
  id: l.id,
  actor: l.user,
  action: l.action.toLowerCase(),
  target: l.target,
  time: l.time,
}))

export const sessions = [
  { id: 's1', device: 'Chrome on Windows 11', location: 'Nairobi, Kenya', ip: '102.68.12.4', lastActive: NOW, current: true },
  { id: 's2', device: 'Safari on iPhone 15', location: 'Nairobi, Kenya', ip: '102.68.12.19', lastActive: isoDaysAgo(1, 19), current: false },
  { id: 's3', device: 'Edge on Windows 10', location: 'Mombasa, Kenya', ip: '41.90.4.188', lastActive: isoDaysAgo(6, 10), current: false },
]

export type Role = 'Owner' | 'Admin' | 'Manager' | 'Analyst' | 'Member'
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: Role
  status: UserStatus
  department: string
  lastActive: string
  joined: string
  location: string
}

export interface Transaction {
  id: string
  customer: string
  email: string
  amount: number
  method: 'Card' | 'Mobile money' | 'Bank transfer' | 'Cash'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  date: string
}

export type NotificationKind = 'system' | 'billing' | 'security' | 'team' | 'mention'
export interface AppNotification {
  id: number
  kind: NotificationKind
  title: string
  body: string
  time: string
  read: boolean
  actor?: string
  link?: string
}

export interface ActivityLog {
  id: number
  user: string
  email: string
  action: string
  type: 'auth' | 'create' | 'update' | 'delete' | 'export' | 'settings'
  target: string
  ip: string
  time: string
  device: string
}

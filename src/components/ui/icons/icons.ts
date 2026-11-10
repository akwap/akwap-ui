import type { Component } from 'vue'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, Bell, Bookmark, Building2, Calendar, ChartColumn, ChartLine, ChartPie, Check,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, CircleCheck, CircleHelp, CircleX, Clock, Contrast, Copy, CreditCard,
  Download, Ellipsis, EllipsisVertical, ExternalLink, Eye, EyeOff, File, FileText, Filter, Folder, Globe, Heart, House, Image, Info, Key,
  LayoutDashboard, Link, Loader, Lock, LockOpen, LogIn, LogOut, Mail, MapPin, Maximize2, Menu, MessageSquare, Minimize2, Minus, Monitor,
  Moon, Paperclip, Pencil, Phone, Plus, Printer, RefreshCw, RotateCcw, Save, Search, Send, Settings, Share2, ShieldCheck, SlidersHorizontal,
  Star, Sun, Tag, Trash2, TriangleAlert, Upload, User, UserPlus, Users, Wallet, X, Zap,
} from '@lucide/vue'

/**
 * The AkwapUI icon set: one agreed icon per meaning, so the same action
 * looks the same everywhere. Icons are Lucide (ISC licence). Use the
 * semantic name with `<AkIcon name="delete" />`, or import any of the
 * ~2,000 Lucide icons directly when there is no semantic entry.
 */
export const iconGroups = {
  Actions: {
    add: { icon: Plus, label: 'Add, create' },
    edit: { icon: Pencil, label: 'Edit' },
    delete: { icon: Trash2, label: 'Delete' },
    save: { icon: Save, label: 'Save' },
    copy: { icon: Copy, label: 'Copy' },
    download: { icon: Download, label: 'Download, export' },
    upload: { icon: Upload, label: 'Upload, import' },
    share: { icon: Share2, label: 'Share' },
    send: { icon: Send, label: 'Send' },
    print: { icon: Printer, label: 'Print' },
    search: { icon: Search, label: 'Search' },
    filter: { icon: Filter, label: 'Filter' },
    sort: { icon: ArrowUpDown, label: 'Sort' },
    adjust: { icon: SlidersHorizontal, label: 'Adjust, view options' },
    refresh: { icon: RefreshCw, label: 'Refresh, sync' },
    undo: { icon: RotateCcw, label: 'Undo, reset' },
    close: { icon: X, label: 'Close, dismiss, clear' },
    more: { icon: Ellipsis, label: 'More actions' },
    moreVertical: { icon: EllipsisVertical, label: 'More actions (vertical)' },
    link: { icon: Link, label: 'Link' },
    externalLink: { icon: ExternalLink, label: 'Opens elsewhere' },
    expand: { icon: Maximize2, label: 'Expand, full screen' },
    collapse: { icon: Minimize2, label: 'Collapse' },
    show: { icon: Eye, label: 'Show, preview' },
    hide: { icon: EyeOff, label: 'Hide' },
    favorite: { icon: Star, label: 'Favourite' },
    like: { icon: Heart, label: 'Like' },
    bookmark: { icon: Bookmark, label: 'Save for later' },
  },
  Navigation: {
    home: { icon: House, label: 'Home' },
    dashboard: { icon: LayoutDashboard, label: 'Dashboard' },
    menu: { icon: Menu, label: 'Open navigation' },
    settings: { icon: Settings, label: 'Settings' },
    back: { icon: ArrowLeft, label: 'Back' },
    forward: { icon: ArrowRight, label: 'Forward, next step' },
    up: { icon: ArrowUp, label: 'Up, increase' },
    down: { icon: ArrowDown, label: 'Down, decrease' },
    chevronLeft: { icon: ChevronLeft, label: 'Previous' },
    chevronRight: { icon: ChevronRight, label: 'Next, drill in' },
    chevronUp: { icon: ChevronUp, label: 'Collapse section' },
    chevronDown: { icon: ChevronDown, label: 'Expand, open menu' },
    signIn: { icon: LogIn, label: 'Sign in' },
    signOut: { icon: LogOut, label: 'Sign out' },
  },
  Status: {
    success: { icon: CircleCheck, label: 'Success, complete' },
    warning: { icon: TriangleAlert, label: 'Warning' },
    error: { icon: CircleAlert, label: 'Error' },
    info: { icon: Info, label: 'Information' },
    help: { icon: CircleHelp, label: 'Help' },
    failed: { icon: CircleX, label: 'Failed, blocked' },
    check: { icon: Check, label: 'Selected, done' },
    remove: { icon: Minus, label: 'Remove, indeterminate' },
    pending: { icon: Clock, label: 'Pending, scheduled' },
    loading: { icon: Loader, label: 'Loading' },
    locked: { icon: Lock, label: 'Locked, private' },
    unlocked: { icon: LockOpen, label: 'Unlocked' },
    secure: { icon: ShieldCheck, label: 'Secure, verified' },
    new: { icon: Zap, label: 'New, quick action' },
  },
  Objects: {
    user: { icon: User, label: 'Person' },
    users: { icon: Users, label: 'People, team' },
    addUser: { icon: UserPlus, label: 'Invite person' },
    organization: { icon: Building2, label: 'Organisation, branch' },
    mail: { icon: Mail, label: 'Email' },
    phone: { icon: Phone, label: 'Phone' },
    message: { icon: MessageSquare, label: 'Message, comment' },
    notification: { icon: Bell, label: 'Notifications' },
    calendar: { icon: Calendar, label: 'Date' },
    time: { icon: Clock, label: 'Time' },
    location: { icon: MapPin, label: 'Location' },
    file: { icon: File, label: 'File' },
    document: { icon: FileText, label: 'Document' },
    folder: { icon: Folder, label: 'Folder' },
    image: { icon: Image, label: 'Image' },
    attachment: { icon: Paperclip, label: 'Attachment' },
    tag: { icon: Tag, label: 'Tag, label' },
    key: { icon: Key, label: 'Key, API token' },
    payment: { icon: CreditCard, label: 'Card payment' },
    wallet: { icon: Wallet, label: 'Wallet, balance' },
    language: { icon: Globe, label: 'Language, region, web' },
  },
  Data: {
    lineChart: { icon: ChartLine, label: 'Trend' },
    barChart: { icon: ChartColumn, label: 'Comparison' },
    pieChart: { icon: ChartPie, label: 'Share of total' },
  },
  Appearance: {
    light: { icon: Sun, label: 'Light theme' },
    dark: { icon: Moon, label: 'Dark theme' },
    highContrast: { icon: Contrast, label: 'High contrast theme' },
    system: { icon: Monitor, label: 'System theme' },
  },
} as const satisfies Record<string, Record<string, { icon: Component; label: string }>>

type Groups = typeof iconGroups
export type IconName = { [G in keyof Groups]: keyof Groups[G] }[keyof Groups] & string

/** Flat map of semantic name → icon component. */
export const icons = Object.fromEntries(
  Object.values(iconGroups).flatMap((g) => Object.entries(g).map(([name, { icon }]) => [name, icon])),
) as Record<IconName, Component>

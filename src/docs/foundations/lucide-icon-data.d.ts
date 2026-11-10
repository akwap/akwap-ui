declare module 'virtual:lucide-icon-data' {
  /** Component name → SVG child nodes ([tag, attributes][]) and alias names for every Lucide icon. */
  const data: Record<string, { node: [string, Record<string, string | number>][]; aliases?: string[] }>
  export default data
}

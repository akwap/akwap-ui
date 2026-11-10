/**
 * Shared shell styling for text-like controls (input, select, textarea,
 * date/time pickers). The bottom "underline" turns brand-coloured on focus —
 * a Fluent-style accent — and an outer ring keeps focus clearly visible.
 */
export function controlShell(opts: { invalid?: boolean; success?: boolean; disabled?: boolean; readonly?: boolean; flush?: boolean }) {
  return [
    'group/control relative flex w-full items-center gap-1.5 rounded-control border bg-control',
    opts.flush ? '' : 'px-control-x',
    'transition-[border-color,box-shadow] duration-faster ease-standard',
    // Focus accent: a 2px brand underline, plus a visible outer focus indicator.
    'after:pointer-events-none after:absolute after:inset-x-[-1px] after:-bottom-px after:h-0.5 after:rounded-b-control after:bg-brand after:scale-x-0 after:transition-transform after:duration-normal after:ease-decelerate',
    'focus-within:after:scale-x-100 focus-within:outline-1 focus-within:outline-offset-0 focus-within:outline-brand-stroke',
    opts.disabled
      ? 'border-line-disabled bg-control-disabled text-disabled cursor-not-allowed'
      : opts.invalid
        ? 'border-danger-strong after:bg-danger-strong focus-within:outline-danger-strong'
        : opts.success
          ? 'border-success-strong'
          : 'border-line border-b-control-underline hover:border-line-hover hover:border-b-line-strong',
    opts.readonly ? 'bg-surface-secondary' : '',
  ]
}

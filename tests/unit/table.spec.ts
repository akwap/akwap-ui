import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AkDataTable, AkPagination, type Column } from '@/design-system'

const rows = [
  { id: 1, name: 'Kwame Mensah', amount: 300 },
  { id: 2, name: 'Amina Okafor', amount: 1200 },
  { id: 3, name: 'Zawadi Njeri', amount: 50 },
]
const columns: Column[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' },
]

describe('AkDataTable', () => {
  it('renders a captioned table with column headers', () => {
    const w = mount(AkDataTable, { props: { columns, rows, caption: 'Customers' } })
    expect(w.find('caption').text()).toBe('Customers')
    expect(w.findAll('th[scope="col"]')).toHaveLength(2)
  })

  it('cycles sort asc → desc → none and sorts rows client-side', async () => {
    const w = mount(AkDataTable, { props: { columns, rows, caption: 'Customers', sort: null, 'onUpdate:sort': (s: unknown) => w.setProps({ sort: s as never }) } })
    const button = w.findAll('th button')[1]!
    await button.trigger('click')
    expect(w.props('sort')).toEqual({ key: 'amount', direction: 'asc' })
    expect(w.findAll('th')[1]!.attributes('aria-sort')).toBe('ascending')
    expect(w.findAll('tbody tr').map((r) => r.findAll('td')[1]!.text())).toEqual(['50', '300', '1,200'].map((v) => expect.stringContaining(v.replace(',', ''))) as never)
    await button.trigger('click')
    expect(w.props('sort')).toEqual({ key: 'amount', direction: 'desc' })
    await button.trigger('click')
    expect(w.props('sort')).toBeNull()
  })

  it('selects rows and all rows', async () => {
    const w = mount(AkDataTable, { props: { columns, rows, caption: 'Customers', selectable: true, selected: [], 'onUpdate:selected': (s: unknown) => w.setProps({ selected: s as never }) } })
    const boxes = w.findAll('input[type="checkbox"]')
    await boxes[1]!.setValue(true)
    expect(w.props('selected')).toEqual([1])
    await w.findAll('input[type="checkbox"]')[0]!.setValue(true)
    expect(w.props('selected')).toEqual([1, 2, 3])
  })

  it('shows the empty state and loading state', () => {
    const empty = mount(AkDataTable, { props: { columns, rows: [], caption: 'Customers', emptyTitle: 'No customers yet' } })
    expect(empty.text()).toContain('No customers yet')
    const loading = mount(AkDataTable, { props: { columns, rows: [], caption: 'Customers', loading: true } })
    expect(loading.find('[role="region"]').attributes('aria-busy')).toBe('true')
  })
})

describe('AkPagination', () => {
  it('labels pages, marks the current one and emits navigation', async () => {
    const w = mount(AkPagination, { props: { page: 2, pageSize: 10, total: 48 } })
    expect(w.find('nav').attributes('aria-label')).toBe('Pagination')
    expect(w.find('[aria-current="page"]').text()).toBe('2')
    expect(w.text()).toContain('48')
    await w.find('button[aria-label="Next page"]').trigger('click')
    expect(w.emitted('update:page')![0]).toEqual([3])
    await w.find('button[aria-label="Page 5"]').trigger('click')
    expect(w.emitted('update:page')![1]).toEqual([5])
  })

  it('disables previous on the first page', () => {
    const w = mount(AkPagination, { props: { page: 1, pageSize: 10, total: 48 } })
    expect(w.find('button[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
  })
})

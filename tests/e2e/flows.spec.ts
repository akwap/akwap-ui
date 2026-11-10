import { expect, setTheme, test } from './fixtures'

test.describe('authentication', () => {
  test('login validates, reports server errors and signs in', async ({ page, errors }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill('') // the demo prefills the email
    await page.getByTestId('login-submit').click()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeFocused()
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')

    await page.getByLabel('Email').fill('amina@akwap.example')
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('wrong-password')
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('login-error')).toContainText('incorrect')

    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Akwap!2026')
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('register shows password strength and mismatch errors', async ({ page }) => {
    await page.goto('/auth/register')
    await page.locator('h1').waitFor()
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('abc')
    await expect(page.getByText(/Password strength/)).toBeAttached()
    await page.getByLabel('Confirm password').fill('abd')
    await page.getByLabel('Confirm password').blur()
    await expect(page.getByText(/do not match/i)).toBeVisible()
  })
})

test.describe('themes', () => {
  test('theme switcher applies and persists a theme', async ({ page }) => {
    await page.goto('/docs/introduction/overview')
    await page.getByTestId('theme-switcher').click()
    await page.getByRole('menuitemcheckbox', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(bg).not.toBe('rgb(255, 255, 255)')
  })

  test('high contrast theme loads from storage before paint', async ({ page }) => {
    await setTheme(page, 'high-contrast')
    await page.goto('/dashboard')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast')
  })

  test('brand colour changes from system settings recolour the app', async ({ page }) => {
    await page.goto('/docs/playground')
    const frame = page.frameLocator('[data-testid=pg-frame]')
    await expect(frame.getByTestId('pg-button')).toBeVisible()
    await page.getByRole('button', { name: /Teal/ }).click()
    await page.getByTestId('pg-apply-site').click()
    await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--ak-brand-hue'))).not.toBe('')
    await page.goto('/dashboard')
    const hue = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ak-brand-hue').trim())
    expect(Number(hue)).toBeGreaterThan(160)
    expect(Number(hue)).toBeLessThan(200)
  })
})

test.describe('navigation and keyboard', () => {
  test('skip link is the first tab stop and moves focus to main', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('h1').waitFor()
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })

  test('mobile navigation drawer opens, navigates and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/dashboard')
    await page.getByTestId('mobile-nav-toggle').click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    await drawer.getByRole('link', { name: 'Analytics' }).click()
    await expect(page).toHaveURL(/\/dashboard\/analytics$/)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('command palette opens with Ctrl+K and runs a command', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('h1').waitFor()
    await page.keyboard.press('Control+k')
    const input = page.getByRole('combobox')
    await expect(input).toBeFocused()
    await input.fill('users')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/dashboard\/users$/)
  })

  test('buttons that navigate are real links', async ({ page }) => {
    await page.goto('/docs/components/button')
    await expect(page.getByRole('link', { name: 'Playground' }).first()).toHaveAttribute('href', '/docs/playground')
  })
})

test.describe('dialogs and data', () => {
  test('add user dialog validates, traps focus and restores it', async ({ page }) => {
    await page.goto('/dashboard/users')
    const trigger = page.getByTestId('add-user')
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Add user' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel('Full name')).toBeFocused()
    await dialog.getByRole('button', { name: 'Send invitation' }).click()
    await expect(dialog.getByText('Full name is required').or(dialog.getByText(/name is required/i)).first()).toBeVisible()
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })

  test('creating a user adds a row and announces it', async ({ page }) => {
    await page.goto('/dashboard/users')
    await page.getByTestId('add-user').click()
    const dialog = page.getByRole('dialog', { name: 'Add user' })
    await dialog.getByLabel('Full name').fill('Test Person')
    await dialog.getByLabel('Email').fill('test.person@akwap.example')
    await dialog.getByRole('button', { name: 'Send invitation' }).click()
    await expect(dialog).toHaveCount(0)
    await page.getByTestId('user-search').locator('input').or(page.getByLabel('Search users')).first().fill('Test Person')
    await expect(page.getByRole('cell', { name: /Test Person/ }).first()).toBeVisible()
  })

  test('table sorting updates aria-sort', async ({ page }) => {
    await page.goto('/dashboard/users')
    const header = page.getByRole('columnheader', { name: /Name/ }).first()
    await header.getByRole('button').click()
    await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)
  })

  test('docs examples copy their code', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/docs/components/button')
    await page.getByTestId('copy-code').nth(1).click()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain('<AkButton')
  })
})

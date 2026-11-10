import { appRoutes, docRoutes } from './routes'
import { expect, test } from './fixtures'

for (const path of [...appRoutes, ...docRoutes]) {
  test(`loads ${path} without errors`, async ({ page, errors }) => {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page).toHaveTitle(/AkwapUI/)
    await expect(page.locator('main, #main').first()).toBeAttached()
    expect(errors).toEqual([])
  })
}

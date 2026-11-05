import { expect, test, type Page } from '@playwright/test';

async function expectScreen(page: Page, path: RegExp, heading: string) {
  await expect(page).toHaveURL(path);
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
}

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'Runs on the Pixel project');

  test('reaches every route from the navigation', async ({ page }) => {
    await page.goto('/');
    await expectScreen(page, /\/$/, 'Learning path');

    const nav = page.getByRole('navigation', { name: 'Main' });
    const box = await nav.boundingBox();
    const viewport = page.viewportSize();
    // On phones the main navigation is a bar along the bottom edge.
    expect(box && viewport && Math.round(box.y + box.height)).toBe(viewport?.height);

    await nav.getByRole('link', { name: 'Practice' }).tap();
    await expectScreen(page, /\/practice$/, 'Practice');

    await nav.getByRole('link', { name: 'Words' }).tap();
    await expectScreen(page, /\/words$/, 'Words');

    await nav.getByRole('link', { name: 'Progress' }).tap();
    await expectScreen(page, /\/progress$/, 'Progress');

    await page.getByRole('link', { name: 'Settings' }).tap();
    await expectScreen(page, /\/settings$/, 'Settings');

    await page.getByRole('link', { name: 'Credits and sources' }).tap();
    await expectScreen(page, /\/credits$/, 'Credits');

    await nav.getByRole('link', { name: 'Learn' }).tap();
    await expectScreen(page, /\/$/, 'Learning path');

    await page.getByRole('link', { name: 'Open a sample lesson' }).tap();
    await expectScreen(page, /\/lesson\/example$/, 'Lesson');
  });

  test('fits a 360px screen without sideways scrolling', async ({ page }) => {
    for (const path of ['/', '/practice', '/words', '/progress', '/settings', '/credits']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBe(0);
    }
  });
});

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => isMobile, 'Runs on the Desktop project');

  test('shows the main navigation in the top bar', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    const header = page.getByRole('banner');
    await expect(header.getByRole('navigation', { name: 'Main' })).toBeVisible();
    const box = await nav.boundingBox();
    expect(box?.y).toBeLessThan(100);

    await nav.getByRole('link', { name: 'Progress' }).click();
    await expectScreen(page, /\/progress$/, 'Progress');
    await expect(nav.getByRole('link', { name: 'Progress' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('works with the keyboard alone', async ({ page }) => {
    await page.goto('/');

    // The first Tab stop is the skip link, and it jumps past the header.
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    // Brand link, then the four main links: Learn, Practice, Words, Progress.
    for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Practice' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expectScreen(page, /\/practice$/, 'Practice');
    await expect(page.getByRole('heading', { level: 1, name: 'Practice' })).toBeFocused();
  });

  test('shows a friendly page for unknown addresses', async ({ page }) => {
    await page.goto('/nowhere');
    await expectScreen(page, /\/nowhere$/, 'Page not found');
  });
});

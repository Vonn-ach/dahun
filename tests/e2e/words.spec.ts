import { expect, test } from '@playwright/test';

// The e2e server runs the placeholder "tst" course from
// tests/fixtures/packs/valid in a draft build (npm run dev:e2e): 6 entries in
// 2 units, of which 2 are drafts and 1 is speaker-checked. Its forms are
// placeholder words, not any real language.

test('lists the words, with search and unit filters', async ({ page }) => {
  await page.goto('/words');
  await expect(page.getByRole('heading', { level: 1, name: 'Words' })).toBeVisible();
  await expect(page.getByRole('note')).toContainText('Preview');

  const status = page.getByRole('status');
  await expect(status).toHaveText('Showing 6 of 6 words');
  const list = page.getByRole('list', { name: 'Word list' });
  await expect(list.locator('[data-entry-id]')).toHaveCount(6);
  await expect(list.getByText('Draft', { exact: true })).toHaveCount(2);
  await expect(list.getByText('Checked by one speaker', { exact: true })).toHaveCount(1);

  // Search by English gloss, then by a variant spelling.
  const search = page.getByRole('searchbox', { name: 'Search words' });
  await search.fill('stone');
  await expect(status).toHaveText('Showing 1 of 6 words');
  await expect(list.locator('[data-entry-id="tst-0001"]')).toContainText('stone');
  await search.fill('charly');
  await expect(list.locator('[data-entry-id="tst-0003"]')).toBeVisible();

  // A unit chip narrows the list, and "All units" brings it back.
  await search.fill('');
  const chips = page.getByRole('group', { name: 'Show words from' });
  await chips.getByRole('button', { name: 'More' }).click();
  await expect(chips.getByRole('button', { name: 'More' })).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toHaveText('Showing 3 of 6 words');
  await chips.getByRole('button', { name: 'All units' }).click();
  await expect(status).toHaveText('Showing 6 of 6 words');
});

test('the word search and unit chips work with the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard check runs on the Desktop project');
  await page.goto('/words');
  await page.getByRole('searchbox', { name: 'Search words' }).focus();
  await page.keyboard.type('river');
  await expect(
    page.getByRole('list', { name: 'Word list' }).locator('[data-entry-id]').first(),
  ).toContainText('river');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'All units' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Basics' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

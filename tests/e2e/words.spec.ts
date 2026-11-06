import { expect, test } from '@playwright/test';

// The dev server runs on the draft bundle (npm run dev builds it first), so
// every seed entry is listed, each with a "Draft" badge. These checks use
// counts, ids and English glosses, never Kayan text.

test('lists the draft words, with search and unit filters', async ({ page }) => {
  await page.goto('/words');
  await expect(page.getByRole('heading', { level: 1, name: 'Words' })).toBeVisible();
  await expect(page.getByRole('note')).toContainText('Preview');

  const status = page.getByRole('status');
  const total = Number((await status.textContent())?.match(/of (\d+) words/)?.[1]);
  expect(total).toBeGreaterThan(0);
  await expect(status).toHaveText(`Showing ${total} of ${total} words`);

  const list = page.getByRole('list', { name: 'Word list' });
  await expect(list.locator('[data-entry-id]')).toHaveCount(total);
  await expect(list.getByText('Draft', { exact: true })).toHaveCount(total);

  // Search by English gloss.
  await page.getByRole('searchbox', { name: 'Search words' }).fill('mother');
  await expect(status).not.toHaveText(`Showing ${total} of ${total} words`);
  const firstMatch = list.locator('[data-entry-id]').first();
  await expect(firstMatch).toContainText('mother');

  // A unit chip narrows the list, and "All units" brings it back.
  await page.getByRole('searchbox', { name: 'Search words' }).fill('');
  const chips = page.getByRole('group', { name: 'Show words from' });
  await chips.getByRole('button', { name: 'Numbers' }).click();
  await expect(chips.getByRole('button', { name: 'Numbers' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const inUnit = Number((await status.textContent())?.match(/Showing (\d+)/)?.[1]);
  expect(inUnit).toBeGreaterThan(0);
  expect(inUnit).toBeLessThan(total);
  await chips.getByRole('button', { name: 'All units' }).click();
  await expect(status).toHaveText(`Showing ${total} of ${total} words`);
});

test('the word search and unit chips work with the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard check runs on the Desktop project');
  await page.goto('/words');
  const search = page.getByRole('searchbox', { name: 'Search words' });
  await search.focus();
  await page.keyboard.type('father');
  await expect(
    page.getByRole('list', { name: 'Word list' }).locator('[data-entry-id]').first(),
  ).toContainText('father');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'All units' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Greetings & courtesy' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

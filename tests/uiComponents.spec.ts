import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test.describe('UI Components', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 1000 });

        // generic assertion
        const inputValue = usingTheGridEmailInput.inputValue();
        expect(inputValue).toBe('test2@test.com');

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });
});
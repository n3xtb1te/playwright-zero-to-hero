import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test.describe('UI Components', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test.skip('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 });

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toBe('test2@test.com');

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });

    test.skip('radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked();
        expect(radioStatus).toBeTruthy();
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).toBeChecked();

        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        expect(await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();
    });
});

test.skip('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

    const allBoxes = page.getByRole('checkbox');
    for (const box of await allBoxes.all()) {
        await box.check({ force: true });
        expect(await box.isChecked()).toBeTruthy();
    }

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true });
        expect(await box.isChecked()).toBeFalsy();
    }
});

test.skip('lists and dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    page.getByRole('list'); // when the list has a UL tag
    page.getByRole('listitem'); // when the list has LI tag

    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

    await optionList.filter({ hasText: 'Cosmic' }).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)',
    };

    await dropDownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if (color != 'Corporate') {
            await dropDownMenu.click();
        }
    }
});

test.skip('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
    await tooltipCard.getByRole('button', { name: 'Top' }).hover();

    page.getByRole('tooltip'); // if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});

test.skip('dialog boxes simple', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();
    await page.getByRole('button', { name: 'Open Dialog with component' }).click();
    await page.getByRole('button', { name: 'Dismiss Dialog' }).click();
});

test.skip('dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    });

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // await page.getByRole('table').locator('tr', { hasText: 'twitter@outlook.com' }).locator('.nb-edit').click();
    
    // get the row by any text in this row
    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' });
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();
});
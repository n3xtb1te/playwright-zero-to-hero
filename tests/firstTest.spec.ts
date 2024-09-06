import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test.skip('the first test', async ({ page }) => {
    await page.getByText('Form Layouts').click();
});

test.skip('navigate to datepicker page', async ({ page }) => {
    await page.getByText('Datepicker').click();
});

test.skip('locator syntax rules', async ({ page }) => {
    // by Tag Name
    page.locator('input');

    // by ID
    page.locator('#inputEmail1');

    // by Class Name
    page.locator('.shape-rectangle');

    // by Attribute
    page.locator('[placeholder="Email"]');

    // by Class Full Value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]');

    // by Xpath (not recommended)
    page.locator('//*input[@id="inputEmail1"]');

    // by partial text match
    page.locator(':text("Using)');

    // by exact text match
    page.locator(':text-is("Using the Grid")');
});

test.skip('user facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.getByRole('button', { name: 'Sign in' }).first().click();

    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').first().click();

    await page.getByText('Using the Grid').click();

    await page.getByTestId('SignIn').click();

    await page.getByTitle('IoT Dashboard').click();
});

test.skip('locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();

    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

    // avoid this approach
    await page.locator('nb-card').nth(3).getByRole('button').click();
});

test.skip('locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: 'Password' }).click();

    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: 'Sign in'})
        .getByRole('textbox', { name: 'Email' }).click();
});

test.skip('reusing locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });

    await basicForm.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await basicForm.getByRole('textbox', { name: 'Password' }).fill('Welcome123');
    await basicForm.getByRole('button').click();
});

test.skip('extracting value' , async ({ page }) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });

    const buttonText = await basicForm.locator('button').textContent();

    expect(buttonText).toBe('Submit'); 

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();

    expect(allRadioButtonsLabels).toContain('Option 1');

    // input value
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    await emailField.fill('test@test.com');
    const emailValue = await emailField.inputValue();

    expect(emailValue).toEqual('test@test.com');

    // attribute value
    const placeholderValue = await emailField.getAttribute('placeholder');

    expect(placeholderValue).toEqual('Email');
});

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic form' }).locator('button');
    // general assertions
    const value = 5;
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit');

    // locator assertions
    await expect(basicFormButton).toHaveText('Submit');

    // soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit5');
    await basicFormButton.click();
});
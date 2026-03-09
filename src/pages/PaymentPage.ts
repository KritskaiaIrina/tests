import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  waitForRecalculation() {
    throw new Error('Method not implemented.');
  }
  private page: Page;

  readonly receiveAmountInput: Locator;
  readonly continueButton: Locator;
  readonly minAmountError: Locator;
  readonly receiveCurrencyTrigger: Locator;

  private readonly verificationDialog: Locator;
  private readonly receiveCurrencySelect: Locator;
  private readonly rateOrLoaderHint: Locator;

  constructor(page: Page) {
    this.page = page;

    this.receiveAmountInput = page.getByRole('textbox', { name: /к получению/i });
    this.continueButton = page.getByRole('button', { name: 'Продолжить' });
    this.receiveCurrencyTrigger = page.locator('[role="combobox"]:not([disabled])').first();
    this.minAmountError = page.getByText(/не менее|min/i).first();

        this.verificationDialog = page.getByRole('dialog').filter({
      hasText: /пропустить проверку|требуется проверка/i,
    });

    this.receiveCurrencySelect = page
      .getByRole('combobox', { name: /к получению|валюта/i })
      .or(page.locator('[data-testid="receive-currency"], [name="receiveCurrency"]'))
      .first();

    // Хинт для ожидания перерасчёта: или скрывается loader, или появляется курс/итоговая сумма.
    this.rateOrLoaderHint = page
      .locator('[data-testid="amount-loader"], [aria-busy="true"], text=/курс|комиссия|итого/i')
      .first();
  }

  async gotoSendFiat() {
    await this.page.goto('https://app.ab-payments.ru/?paymentCommonType=fiat&direction=SEND');
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissVerificationDialog();
  }

  async dismissVerificationDialog() {
<<<<<<< ours
    const button = this.page.locator('.btn-text-default');
    const isVisible = await button.isVisible().catch(() => false);

    if (isVisible) {
      await button.click();
    } else {
      console.log('Verification dialog button not found, skipping dismissal');
    }
=======
    if (!(await this.verificationDialog.isVisible().catch(() => false))) return;

    const skipButtons = [
      /все равно пропустить/i,
      /пропустить в этот раз/i,
      /^пропустить$/i,
    ];

    for (const name of skipButtons) {
      const button = this.verificationDialog.getByRole('button', { name });
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        break;
      }
    }

    await expect(this.verificationDialog).toBeHidden({ timeout: 15_000 });
>>>>>>> theirs
  }

  async selectReceiveCurrency(currency: string) {
<<<<<<< ours
=======
    await this.dismissVerificationDialog();

    await expect(this.receiveCurrencySelect).toBeVisible({ timeout: 30_000 });
    await this.receiveCurrencySelect.click();

    const option = this.page
      .getByRole('option', { name: new RegExp(`^${currency}$`, 'i') })
      .or(this.page.getByText(new RegExp(`^${currency}$`, 'i')))
      .first();

    await expect(option).toBeVisible({ timeout: 10_000 });
    await option.click();
  }

  async waitForRecalculation() {
    await this.dismissVerificationDialog();

    // Дожидаемся завершения анимаций/перерасчёта без привязки к одному селектору.
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.rateOrLoaderHint.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async selectReceiveCurrency(currency: string) {
    await this.dismissVerificationDialog();

    await expect(this.receiveCurrencySelect).toBeVisible({ timeout: 30_000 });
    await this.receiveCurrencySelect.click();

    const option = this.page
      .getByRole('option', { name: new RegExp(`^${currency}$`, 'i') })
      .or(this.page.getByText(new RegExp(`^${currency}$`, 'i')))
      .first();

    await expect(option).toBeVisible({ timeout: 10_000 });
    await option.click();
  }

  async waitForRecalculation() {
    await this.dismissVerificationDialog();

    // Дожидаемся завершения анимаций/перерасчёта без привязки к одному селектору.
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.rateOrLoaderHint.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async fillReceiveAmount(value: string) {
    // модалка может всплыть асинхронно
>>>>>>> theirs
    await this.dismissVerificationDialog();
<<<<<<< ours
    await expect(this.receiveCurrencyTrigger).toBeVisible();
    await this.receiveCurrencyTrigger.click();
    
    const option = this.page.getByText(currency, { exact: true }).first();
    await expect(option).toBeVisible();
    await option.click();
  }
=======

    await expect(this.receiveCurrencySelect).toBeVisible({ timeout: 30_000 });
    await this.receiveCurrencySelect.click();

    const option = this.page
      .getByRole('option', { name: new RegExp(`^${currency}$`, 'i') })
      .or(this.page.getByText(new RegExp(`^${currency}$`, 'i')))
      .first();

    await expect(option).toBeVisible({ timeout: 10_000 });
    await option.click();
  }

  async waitForRecalculation() {
    await this.dismissVerificationDialog();

    // Дожидаемся завершения анимаций/перерасчёта без привязки к одному селектору.
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.rateOrLoaderHint.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

>>>>>>> theirs
  async fillReceiveAmount(value: string) {
    await this.dismissVerificationDialog();
  
    await expect(this.receiveAmountInput).toBeVisible();
    await this.receiveAmountInput.fill(value);
    await this.receiveAmountInput.press('Tab').catch(() => {});
  }

  async expectContinueDisabled() {
    await expect(this.continueButton).toBeDisabled();
  }

  async expectMinAmountErrorVisible() {
    await expect(this.minAmountError).toBeVisible();
  }
}

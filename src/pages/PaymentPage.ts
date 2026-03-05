import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  private page: Page;

  readonly receiveAmountInput: Locator;
  readonly continueButton: Locator;
  readonly minAmountError: Locator;

  private readonly verificationDialog: Locator;

  constructor(page: Page) {
    this.page = page;

    this.receiveAmountInput = page.getByRole('textbox', { name: /к получению/i });
    this.continueButton = page.getByRole('button', { name: 'Продолжить' });

    // оставим мягко: ошибка может быть разной формулировки
    this.minAmountError = page.getByText(/минимальн|min/i).first();

    // Важно: это именно dialog-оверлей, который блокирует клики
    this.verificationDialog = page.getByRole('dialog').filter({
      hasText: /пропустить проверку|требуется проверка/i,
    });
  }

  async gotoSendFiat() {
    await this.page.goto('https://app.ab-payments.ru/?paymentCommonType=fiat&direction=SEND');
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissVerificationDialog();
  }

  async dismissVerificationDialog() {
    if (!(await this.verificationDialog.isVisible().catch(() => false))) return;

    // В твоём кейсе есть "Все равно пропустить" (active)
    const skipAnyway = this.verificationDialog.getByRole('button', {
      name: /все равно пропустить/i,
    });

    // Другие варианты, если UI поменяется
    const skipOnce = this.verificationDialog.getByRole('button', {
      name: /пропустить в этот раз/i,
    });
    const skip = this.verificationDialog.getByRole('button', { name: /^пропустить$/i });

    if (await skipAnyway.isVisible().catch(() => false)) await skipAnyway.click();
    else if (await skipOnce.isVisible().catch(() => false)) await skipOnce.click();
    else if (await skip.isVisible().catch(() => false)) await skip.click();

    await expect(this.verificationDialog).toBeHidden({ timeout: 15_000 });
  }

  async fillReceiveAmount(value: string) {
    // модалка может всплыть асинхронно
    await this.dismissVerificationDialog();

    await expect(this.receiveAmountInput).toBeVisible({ timeout: 30_000 });
    await this.receiveAmountInput.fill(value);
    await this.receiveAmountInput.press('Tab').catch(() => {});
  }

  async expectContinueDisabled() {
    await expect(this.continueButton).toBeDisabled({ timeout: 30_000 });
  }

  async expectMinAmountErrorVisible() {
    await expect(this.minAmountError).toBeVisible({ timeout: 30_000 });
  }
}
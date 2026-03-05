import { test, expect } from '@playwright/test';
import { PaymentPage } from '../src/pages/PaymentPage';

test.describe('Payments', () => {
  test('ТК1: Минимальная сумма платежа — ошибка и "Продолжить" неактивна', async ({ page }) => {
    // Предусловие: пользователь авторизован
    const payment = new PaymentPage(page);

    // 1. Перейти на /?paymentCommonType=fiat&direction=SEND
    await payment.gotoSendFiat();

    // 2. В форме: выбрать CNY и ввести 1000 в "Сумма к получению"
    await payment.selectReceiveCurrency('CNY');
    await payment.fillReceiveAmount('1000');

    // 3. Дождаться перерасчета
    await payment.waitForRecalculation();

    // ОР: ошибка о минимальной сумме видна, кнопка "Продолжить" disabled
    await payment.expectMinAmountErrorVisible();
    await payment.expectContinueDisabled();

    // Маленькая доп. гарантия: если кнопку вдруг можно нажать — это провал
    await expect(payment.continueButton).toBeDisabled();
  });
});
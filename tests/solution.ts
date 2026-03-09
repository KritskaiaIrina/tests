async dismissVerificationDialog() {
    const button = this.page.locator('.btn-text-default');
    const isVisible = await button.isVisible().catch(() => false);

    if (isVisible) {
      await button.click();
    } else {
      console.log('Verification dialog button not found, skipping dismissal');
    }
  }


    // 2. В форме: выбрать CNY и ввести 1000 в "Сумма к получению"
    // await payment.selectReceiveCurrency('CNY');
    await page.locator('.btn-text-default').waitFor({ state: 'visible' });
    await page.locator('.btn-text-default').click()
    await payment.fillReceiveAmount('1000');
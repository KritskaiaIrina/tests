import { test as setup, expect } from '@playwright/test';

setup.setTimeout(0); // чтобы ты спокойно ввела OTP вручную

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

setup('auth (manual OTP) -> save storage state', async ({ page }) => {
  if (!EMAIL) throw new Error('TEST_EMAIL is not set');
  if (!PASSWORD) throw new Error('TEST_PASSWORD is not set');

  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
  await emailInput.fill(EMAIL);

  await page.getByRole('button', { name: 'Далее' }).click();

  // 4) OTP экран — ввод вручную
  await expect(page.getByRole('heading', { name: /подтверждение/i })).toBeVisible({
    timeout: 30_000,
  });

  await page.pause(); // тут ты вводишь OTP и нажимаешь "Подтвердить" в UI

  // 5) После OTP вводим пароль - надо запустить в ручную, нажав на зеленый треугольник.
  const passwordInput = page.locator('input[type="password"]');
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(PASSWORD);

  await page.getByRole('button', { name: /войти/i }).click();

  // 6) Ждём, что мы вышли из auth-флоу
  await expect(page).not.toHaveURL(/\/auth/i, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');

  await page.pause(); // тут надо прокликать "пропустить"

  // 7) Сохраняем сессию
  await page.context().storageState({ path: 'storageState.json' });
});
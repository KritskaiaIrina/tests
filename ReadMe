Uluky E2E Tests

Автоматизированные end-to-end тесты для платежного интерфейса Uluky.

Тесты написаны с использованием Playwright + TypeScript и реализованы по паттерну Page Object Model (POM).

Технологии

Playwright

TypeScript

Node.js

Page Object Model

Структура проекта
e2e/
 ├ pages/                # Page Object классы
 │   └ PaymentPage.ts
 │
 ├ tests/                # тестовые сценарии
 │   └ payment.spec.ts
 │
 ├ fixtures/             # фикстуры (если используются)
 │
 ├ playwright.config.ts  # конфигурация Playwright
 ├ package.json
 └ README.md
Подход к тестированию

В проекте используется Page Object Model:

вся логика работы со страницей находится в pages

тесты содержат только сценарий проверки

локаторы инкапсулированы внутри Page Object

Каждый тест:

независимый

воспроизводимый

не зависит от результатов других тестов

Установка проекта

Клонировать репозиторий:

git clone https://github.com/KritskaiaIrina/tests.git

Перейти в папку проекта:

cd tests

Установить зависимости:

npm install

Установить браузеры Playwright:

npx playwright install
Запуск тестов

Запуск всех тестов:

npx playwright test

Запуск конкретного теста:

npx playwright test tests/payment.spec.ts

Запуск тестов в UI режиме:

npx playwright test --ui
Отчеты

После выполнения тестов можно открыть HTML отчет:

npx playwright show-report
Пример теста
test('Минимальная сумма платежа — кнопка неактивна', async ({ page }) => {
  const paymentPage = new PaymentPage(page)

  await paymentPage.gotoSendFiat()
  await paymentPage.enterAmount('1')

  await expect(paymentPage.minAmountError).toBeVisible()
  await expect(paymentPage.continueButton).toBeDisabled()
})
Цель проекта

Автоматизация проверки платежного интерфейса:

проверка бизнес-логики платежей

валидации сумм

доступности кнопок

отображения ошибок

Автор

Irina Kritskaia
QA Automation
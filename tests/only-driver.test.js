require('chromedriver');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

jest.setTimeout(30000);

test('Cria o driver do Chrome simples', async () => {
    console.log('🔧 Tentando criar driver');

    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    options.addArguments('--incognito');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    console.log('✅ Driver criado');
    await driver.get('https://google.com');
    await driver.sleep(2000);
    await driver.quit();
});

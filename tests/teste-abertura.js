const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

(async () => {
    const options = new chrome.Options();
    options.addArguments('--start-maximized', '--incognito');
    options.excludeSwitches = ['enable-automation'];

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.get('https://google.com');
    await driver.sleep(3000);
    await driver.quit();
})();

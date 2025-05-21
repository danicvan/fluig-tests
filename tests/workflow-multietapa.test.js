require('dotenv').config();
require('chromedriver');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

jest.setTimeout(120000);

let screenshotIndex = 0;
async function captureStepScreenshot(driver, label = '') {
    screenshotIndex++;
    const filename = `step-${screenshotIndex}-${label}.png`.replace(/\s+/g, '_');
    const filepath = path.resolve(__dirname, `../results/screenshots/${filename}`);
    const img = await driver.takeScreenshot();
    fs.writeFileSync(filepath, img, 'base64');
    log(`📸 Screenshot salva: ${filename}`);
}

describe('Fluig – Workflow de múltiplas etapas', () => {
    it('deve iniciar e concluir um processo de duas etapas', async () => {
        console.log('🚀 Iniciando execução do teste');

        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        options.addArguments('--incognito');
        options.excludeSwitches = ['enable-automation'];

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        console.log('✅ Driver criado com sucesso');

        try {
            log('>> Iniciando teste');

            await driver.get(process.env.FLUIG_URL);
            await driver.findElement(By.id('username')).sendKeys(process.env.FLUIG_USER);
            await driver.findElement(By.id('password')).sendKeys(process.env.FLUIG_PASSWORD);
            await driver.findElement(By.id('submitLogin')).click();

            await driver.wait(until.urlContains('home'), 10000);
            log('✅ Login realizado');
            await captureStepScreenshot(driver, 'login-ok');

            try {
                const popup = await driver.findElement(By.xpath("//button[text()='OK']"));
                await driver.wait(until.elementIsVisible(popup), 3000);
                await popup.click();
                log('🔒 Alerta de senha fechado');
                await captureStepScreenshot(driver, 'alerta-senha-fechado');
            } catch {
                log('ℹ️ Nenhum alerta de senha visível');
            }

            await driver.findElement(By.css('[data-toggle-main-menu]')).click();
            await captureStepScreenshot(driver, 'menu-lateral-aberto');

            const processosMenu = await driver.wait(until.elementLocated(By.xpath("//span[@title='Processos']")), 10000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", processosMenu);
            await driver.wait(until.elementIsVisible(processosMenu), 10000);
            await processosMenu.click();
            log('✅ Clicou em "Processos"');
            await captureStepScreenshot(driver, 'clicou-processos');

            const iniciarSolic = await driver.wait(until.elementLocated(By.xpath("//span[@title='Iniciar Solicitações']")), 10000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", iniciarSolic);
            await driver.wait(until.elementIsVisible(iniciarSolic), 10000);
            await iniciarSolic.click();
            log('✅ Clicou em "Iniciar Solicitações"');
            await captureStepScreenshot(driver, 'clicou-iniciar-solicitacoes');

            const cadastroNode = await driver.wait(until.elementLocated(By.xpath("//span[@class='fancytree-title' and text()='Cadastro']")), 10000);
            await driver.wait(until.elementIsVisible(cadastroNode), 10000);
            await cadastroNode.click();
            log('✅ Clicou em "Cadastro"');
            await captureStepScreenshot(driver, 'clicou-cadastro');

            const cadastroClientes = await driver.wait(until.elementLocated(By.xpath("//td[@processid='WKF_CADASTRO_DE_CLIENTES']")), 10000);
            await driver.wait(until.elementIsVisible(cadastroClientes), 10000);
            await cadastroClientes.click();
            log('✅ Clicou em "Cadastro de Clientes"');
            await captureStepScreenshot(driver, 'clicou-cadastro-clientes');

            await driver.wait(until.elementLocated(By.name('campo_formulario')), 15000);
            await driver.findElement(By.name('campo_formulario')).sendKeys('Etapa 1 automatizada');
            await captureStepScreenshot(driver, 'formulario-preenchido-etapa-1');
            await driver.findElement(By.id('btEnviar')).click();
            log('✅ Primeira etapa enviada');

            await driver.sleep(5000);
            await driver.findElement(By.linkText('Tarefas')).click();
            await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Assumir')]")), 10000);
            await driver.findElement(By.xpath("//a[contains(text(),'Assumir')]")).click();
            log('✅ Segunda etapa assumida');
            await captureStepScreenshot(driver, 'segunda-etapa-assumida');

            await driver.wait(until.elementLocated(By.name('campo_segunda_etapa')), 10000);
            await driver.findElement(By.name('campo_segunda_etapa')).sendKeys('Etapa 2 automatizada');
            await captureStepScreenshot(driver, 'formulario-preenchido-etapa-2');
            await driver.findElement(By.id('btEnviar')).click();
            log('✅ Segunda etapa enviada');

        } catch (err) {
            const failurePath = path.resolve(__dirname, '../results/screenshots/failure.png');
            const img = await driver.takeScreenshot();
            fs.writeFileSync(failurePath, img, 'base64');
            log('❌ Erro capturado: ' + err.message);
            throw err;
        } finally {
            await driver.sleep(2000);
            await driver.quit();
            log('>> Teste finalizado');
        }
    });
});

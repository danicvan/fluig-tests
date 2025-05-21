require('dotenv').config();
require('chromedriver');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

// Captura de screenshots por etapa
let screenshotIndex = 0;
async function captureStepScreenshot(driver, label = '') {
    screenshotIndex++;
    const filename = `step-${screenshotIndex}-${label}.png`.replace(/\s+/g, '_');
    const filepath = path.resolve(__dirname, `../results/screenshots/${filename}`);
    const img = await driver.takeScreenshot();
    fs.writeFileSync(filepath, img, 'base64');
    log(`📸 Screenshot salva: ${filename}`);
}

(async () => {
    const options = new chrome.Options();
    // options.addArguments('--start-maximized');
    options.addArguments('--incognito');
    options.excludeSwitches = ['enable-automation'];

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        log('>> Iniciando teste');

        await driver.get(process.env.FLUIG_URL);
        await driver.findElement(By.id('username')).sendKeys(process.env.FLUIG_USER);
        await driver.findElement(By.id('password')).sendKeys(process.env.FLUIG_PASSWORD);
        await driver.findElement(By.id('submitLogin')).click();

        await driver.wait(until.urlContains('home'), 1000);
        log('✅ Login realizado');
        await captureStepScreenshot(driver, 'login-ok');

        try {
            const popup = await driver.findElement(By.xpath("//button[text()='OK']"));
            await driver.wait(until.elementIsVisible(popup), 1000);
            await popup.click();
            log('🔒 Alerta de senha fechado');
            await captureStepScreenshot(driver, 'alerta-senha-fechado');
        } catch {
            log('ℹ️ Nenhum alerta de senha visível');
        }

        await driver.findElement(By.css('[data-toggle-main-menu]')).click();
        await captureStepScreenshot(driver, 'menu-lateral-aberto');

        const processosMenu = await driver.wait(until.elementLocated(By.xpath("//span[@title='Processos']")), 1000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", processosMenu);
        await driver.wait(until.elementIsVisible(processosMenu), 1000);
        await processosMenu.click();
        log('✅ Clicou em "Processos"');
        await captureStepScreenshot(driver, 'clicou-processos');

        const iniciarSolic = await driver.wait(until.elementLocated(By.xpath("//span[@title='Iniciar Solicitações']")), 1000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", iniciarSolic);
        await driver.wait(until.elementIsVisible(iniciarSolic), 1000);
        await iniciarSolic.click();
        log('✅ Clicou em "Iniciar Solicitações"');
        await captureStepScreenshot(driver, 'clicou-iniciar-solicitacoes');

        const cadastroNode = await driver.wait(until.elementLocated(By.xpath("//span[@class='fancytree-title' and text()='Cadastro']")), 1000);
        await driver.wait(until.elementIsVisible(cadastroNode), 1000);
        await cadastroNode.click();
        log('✅ Clicou em "Cadastro"');
        await captureStepScreenshot(driver, 'clicou-cadastro');

        const cadastroClientes = await driver.wait(until.elementLocated(By.xpath("//td[@processid='WKF_CADASTRO_DE_CLIENTES']")), 1000);
        await driver.wait(until.elementIsVisible(cadastroClientes), 1000);
        await cadastroClientes.click();
        log('✅ Clicou em "Cadastro de Clientes"');
        await captureStepScreenshot(driver, 'clicou-cadastro-clientes');

        // 🔄 Trocar para o iframe do formulário
        await driver.wait(until.ableToSwitchToFrame(By.id('workflowView-cardViewer')), 1000);
        log('✅ Trocou para o iframe do formulário');
        await captureStepScreenshot(driver, 'entrou-no-iframe');

        // CLICA NA ABA "CADASTRAIS"
        try {
            const abaCadastrais = await driver.wait(
                until.elementLocated(By.xpath("//strong[normalize-space()='CADASTRAIS']/parent::h3/parent::div")),
                1000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", abaCadastrais);
            await abaCadastrais.click();
            log('✅ Aba "Cadastrais" clicada');
            await captureStepScreenshot(driver, 'aba-cadastrais');
        } catch (e) {
            log('❗ Falha ao clicar na aba "Cadastrais": ' + e.message);
            throw e;
        }

        // PREENCHER CAMPO A1_NOME
        await driver.wait(until.elementLocated(By.name('A1_NOME')), 1000);
        await driver.findElement(By.name('A1_NOME')).sendKeys('Empresa Automatizada Ltda');
        log('✅ Campo A1_NOME preenchido');
        await captureStepScreenshot(driver, 'campo-A1_NOME-preenchido');

        const selectAnaliseArea = await driver.wait(
            until.elementLocated(By.id('hd_necesAnaliseArea')),
            10000
        );

        await driver.wait(until.elementIsVisible(selectAnaliseArea), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", selectAnaliseArea);
        await selectAnaliseArea.sendKeys('Sim'); // seleciona pelo texto visível
        log('✅ Selecionado "Sim" no campo hd_necesAnaliseArea');
        await captureStepScreenshot(driver, 'campo-select-analisearea');

        await driver.switchTo().defaultContent(); // ⬅️ volta para o DOM principal
        log('🔁 Saiu do iframe para acessar o botão Enviar');

        // ENVIAR O PROCESSO
        await driver.sleep(1000); // espera para garantir que o botão esteja visível
        await captureStepScreenshot(driver, 'antes-do-clique-enviar');

        try {
            const botaoEnviar = await driver.wait(
                until.elementLocated(By.id('send-process-button')),
                1000
            );
            await driver.wait(until.elementIsVisible(botaoEnviar), 1000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", botaoEnviar);
            await driver.executeScript("arguments[0].click();", botaoEnviar); // clique via JS
            log('✅ Processo enviado com sucesso');
            await captureStepScreenshot(driver, 'processo-enviado');
        } catch (e) {
            log('❌ Falha ao clicar no botão Enviar: ' + e.message);
            await captureStepScreenshot(driver, 'falha-no-botao-enviar');
            throw e;
        }

    } catch (err) {
        const failurePath = path.resolve(__dirname, '../results/screenshots/failure.png');
        const img = await driver.takeScreenshot();
        fs.writeFileSync(failurePath, img, 'base64');
        log('❌ Erro capturado: ' + err.message);
        throw err;
    } finally {
        await driver.sleep(1000);
        await driver.quit();
        log('>> Teste finalizado');
    }
})();
require('dotenv').config();
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

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

        await driver.wait(until.urlContains('home'), 10000);
        log('✅ Login realizado');
        await captureStepScreenshot(driver, 'login-ok');

        try {
            const popup = await driver.findElement(By.xpath("//button[text()='OK']"));
            await driver.wait(until.elementIsVisible(popup), 10000);
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

        await driver.wait(until.ableToSwitchToFrame(By.id('workflowView-cardViewer')), 10000);
        log('✅ Trocou para o iframe do formulário');
        await captureStepScreenshot(driver, 'entrou-no-iframe');

        const abaCadastrais = await driver.wait(
            until.elementLocated(By.xpath("//strong[normalize-space()='CADASTRAIS']/parent::h3/parent::div")),
            10000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", abaCadastrais);
        await abaCadastrais.click();
        log('✅ Aba "Cadastrais" clicada');
        await captureStepScreenshot(driver, 'aba-cadastrais');

        await driver.wait(until.elementLocated(By.name('A1_NOME')), 10000);
        await driver.findElement(By.name('A1_NOME')).sendKeys('Empresa Automatizada Ltda');
        log('✅ Campo A1_NOME preenchido');
        await captureStepScreenshot(driver, 'campo-A1_NOME-preenchido');

        const selectAnaliseArea = await driver.wait(until.elementLocated(By.id('hd_necesAnaliseArea')), 100000);
        await driver.wait(until.elementIsVisible(selectAnaliseArea), 100000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", selectAnaliseArea);
        await selectAnaliseArea.sendKeys('Sim');
        log('✅ Selecionado "Sim" no campo hd_necesAnaliseArea');
        await captureStepScreenshot(driver, 'campo-select-analisearea');

        const selectTipoCliente = await driver.wait(until.elementLocated(By.id('hd_tipoCliente')), 100000);
        await selectTipoCliente.sendKeys('Cooperado');
        log('✅ Selecionado "Cooperado" no campo hd_tipoCliente');
        await captureStepScreenshot(driver, 'campo-select-tipoCliente');

        await driver.switchTo().defaultContent();
        log('🔁 Saiu do iframe para acessar o botão Enviar');

        await driver.sleep(10000);
        await captureStepScreenshot(driver, 'antes-do-clique-enviar');

        const botaoEnviar = await driver.wait(until.elementLocated(By.id('send-process-button')), 10000);
        await driver.wait(until.elementIsVisible(botaoEnviar), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", botaoEnviar);
        await driver.executeScript("arguments[0].click();", botaoEnviar);
        log('✅ Processo enviado com sucesso');
        await captureStepScreenshot(driver, 'processo-enviado');

        const numeroLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Acessar solicitação')]")), 10000);
        const href = await numeroLink.getAttribute('href');
        const numero = href.match(/ProcessInstanceID=(\d+)/)?.[1];
        log(`🔢 Número da solicitação capturado: ${numero}`);

        // Logout do usuário 1
        const menuUsuario = await driver.findElement(By.css('[data-open-menu-profile]'));
        await menuUsuario.click();
        const sair = await driver.wait(until.elementLocated(By.css('[data-profile-menu-action="logoff"]')), 10000);
        await sair.click();

        // Login com usuário 2
        await driver.findElement(By.id('username')).sendKeys(process.env.FLUIG_USER2);
        await driver.findElement(By.id('password')).sendKeys(process.env.FLUIG_PASSWORD2);
        await driver.findElement(By.id('submitLogin')).click();

        await driver.wait(until.urlContains('home'), 10000);
        log('✅ Login realizado');
        await captureStepScreenshot(driver, 'login-ok');

        try {
            const popup = await driver.findElement(By.xpath("//button[text()='OK']"));
            await driver.wait(until.elementIsVisible(popup), 10000);
            await popup.click();
            log('✅ Login realizado com usuário 2');
            await captureStepScreenshot(driver, 'alerta-senha-fechado');
        } catch {
            log('ℹ️ Nenhum alerta de senha visível');
        }

        // Consultar Solicitação
        await driver.findElement(By.css('[data-toggle-main-menu]')).click();
        await captureStepScreenshot(driver, 'menu-lateral-aberto');

        const processos2 = await driver.wait(until.elementLocated(By.xpath("//span[@title='Processos']")), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", processos2);
        await driver.wait(until.elementIsVisible(processos2), 10000);
        await processos2.click();
        log('✅ Clicou em "Processos"');
        await captureStepScreenshot(driver, 'clicou-processos');

        const consultar = await driver.wait(until.elementLocated(By.xpath("//span[@title='Consultar Solicitações']")), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", consultar);
        await driver.wait(until.elementIsVisible(consultar), 10000);
        await consultar.click();
        log('✅ Clicou em "Consultar Solicitações"');
        await captureStepScreenshot(driver, 'clicou-consultar-solicitacoes');

        const selectFiltro = await driver.wait(until.elementLocated(By.id('filter_type')), 10000);
        await driver.executeScript(`
            const select = arguments[0];
            select.value = 'byRequests';
            select.dispatchEvent(new Event('change'));
            `, selectFiltro);
        log('✅ Tipo de filtro alterado para "Por solicitações"');

        await driver.sleep(1500);

        await driver.executeScript(`
            document.getElementById('filter_by_requests').style.display = 'block';
            document.getElementById('filter_by_requests').focus();
            `);
        log('🔁 Campo forçado para foco e visibilidade');

        await driver.sleep(2000); // dar tempo para realmente renderizar

        const inputSolic = await driver.findElement(By.id('filter_by_requests'));
        await inputSolic.sendKeys(numero, Key.ENTER);
        log('✅ Número da solicitação inserido');
        await captureStepScreenshot(driver, 'campo-numero-solicitacao');
        await driver.sleep(1000);

        const btnBuscar = await driver.findElement(By.css('[data-search-requests]'));
        await driver.wait(until.elementIsVisible(btnBuscar), 10000);
        await btnBuscar.click();

        const linhaSolic = await driver.wait(until.elementLocated(By.xpath(`//tr[@data-process-instance='${numero}']`)), 10000);
        await linhaSolic.click();

        // ⏳ Aguarda abertura da nova aba (após clicar na linha da solicitação)
        await driver.wait(async () => (await driver.getAllWindowHandles()).length > 1, 10000);
        const abas = await driver.getAllWindowHandles();
        await driver.switchTo().window(abas[1]);
        log('🪟 Nova aba da solicitação aberta');
        await captureStepScreenshot(driver, 'nova-aba-solicitacao');

        // ✅ Clicar em "Assumir tarefa"
        const botaoAssumir = await driver.wait(
            until.elementLocated(By.css('button[data-take-task]')),
            10000
        );
        await driver.wait(until.elementIsVisible(botaoAssumir), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", botaoAssumir);
        await driver.sleep(500);
        await botaoAssumir.click();
        log('✅ Tarefa assumida com sucesso');
        await captureStepScreenshot(driver, 'tarefa-assumida');

        await driver.wait(until.ableToSwitchToFrame(By.id('workflowView-cardViewer')), 10000);
        await driver.switchTo().defaultContent();

        await driver.wait(until.ableToSwitchToFrame(By.id('workflowView-cardViewer')), 10000);
        await driver.switchTo().defaultContent();

        const botaoReenviar = await driver.wait(until.elementLocated(By.id('send-process-button')), 10000);
        await driver.wait(until.elementIsVisible(botaoReenviar), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", botaoReenviar);
        await driver.sleep(500);
        await botaoReenviar.click();
        log('✅ Solicitação reenviada pelo usuário 2');
        await captureStepScreenshot(driver, 'reenviado-usuario-2');

        // ⏳ Aguarda carregamento da página de confirmação com link
        const numeroLink2 = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Acessar solicitação')]")), 10000);
        await captureStepScreenshot(driver, 'link-solicitacao-reaberta');

        const href2 = await numeroLink2.getAttribute('href');
        const numero2 = href2.match(/ProcessInstanceID=(\d+)/)?.[1];
        if (!numero2) throw new Error('❌ Número da nova solicitação não foi extraído corretamente!');

        log(`🔢 Número da nova solicitação capturado: ${numero2}`);


    } catch (err) {
        const failurePath = path.resolve(__dirname, '../results/screenshots/failure.png');
        const img = await driver.takeScreenshot();
        fs.writeFileSync(failurePath, img, 'base64');
        log('❌ Erro capturado: ' + err.message);
        throw err;
    } finally {
        await driver.sleep(10000);
        await driver.quit();
        log('>> Teste finalizado');
    }
})();
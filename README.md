# 🧪 Fluig Automated Workflow Tests

[![Node.js](https://img.shields.io/badge/node-%3E=20-green)](https://nodejs.org/)
[![Selenium](https://img.shields.io/badge/tested%20with-selenium%20webdriver-blue)](https://www.selenium.dev/)
[![Jest](https://img.shields.io/badge/jest-tested-informational)](https://jestjs.io/)
[![Chrome](https://img.shields.io/badge/browser-chrome-yellow)]()
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🧭 Overview

This repository contains end-to-end automated tests for TOTVS Fluig workflows using **Node.js**, **Selenium WebDriver**, and **Jest**, running in a real Chrome browser (not headless), with screenshot recording and HTML report generation.

> ✅ Simulates real user behavior  
> 📸 Captures step-by-step screenshots  
> 📋 Generates logs and HTML test reports  
> 🤖 Ready for CI/CD with GitHub Actions or Jenkins

---

## 📂 Project Structure

```bash
fluig-tests/
├── tests/                      # Automated test files
│   └── workflow-multietapa.run.js
├── utils/                      # Helper modules
│   └── logger.js
├── results/                    # Test results
│   ├── screenshots/
│   └── report/
├── .env.example                # Sample environment variables
├── package.json
├── README.md
└── .gitignore
```

---

## ⚙️ Technologies Used

- [Node.js](https://nodejs.org/) `v20+`
- [Selenium WebDriver](https://www.selenium.dev/)
- [Google Chrome](https://www.google.com/chrome/)
- [Jest](https://jestjs.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [chromedriver](https://www.npmjs.com/package/chromedriver)

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-user/fluig-tests.git
cd fluig-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the `.env` file

```env
# .env
FLUIG_URL=https://devfluig.example.com
FLUIG_USER=your_username
FLUIG_PASSWORD=your_password
```

> ⚠️ Never commit your `.env` file. Use `.env.example` instead.

### 4. Run the test

```bash
node tests/workflow-multietapa.run.js
```

---

## 📸 Screenshot Examples

| Step                    | Screenshot                                              |
| ----------------------- | ------------------------------------------------------- |
| Login successful        | ![](./results/screenshots/step-1-login-ok.png)          |
| "Cadastrais" tab opened | ![](./results/screenshots/step-8-aba-cadastrais.png)    |
| Workflow submitted      | ![](./results/screenshots/step-12-processo-enviado.png) |

---

## 📊 HTML Report

You can generate and open the test report with:

```bash
npm test
open results/report/index.html
```

---

## 🔐 .env.example

```ini
FLUIG_URL=https://your-fluig-instance.com
FLUIG_USER=your.username
FLUIG_PASSWORD=your.secret.password
```

---

## 🧱 Next Improvements

- [ ] Run tests with multiple workflows
- [ ] Use dynamic input data (test data generation)
- [ ] Integrate with CI/CD (GitHub Actions, Jenkins)
- [ ] Parallel browser testing (Docker + Grid)
- [ ] Record screen videos with `ffmpeg`

---

## 📜 License

[MIT License](./LICENSE)

---

## 💬 Contributing

Feel free to open issues or submit pull requests with suggestions and improvements.

---

> Built with 💻, ☕ and lots of `await driver.findElement()` 😄

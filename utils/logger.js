const fs = require('fs');
const path = require('path');
const logPath = path.resolve(__dirname, '../results/log.txt');

function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}`;
    console.log(entry);
    fs.appendFileSync(logPath, entry + '\n');
}

module.exports = { log };
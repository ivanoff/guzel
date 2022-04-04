const guzel = require('guzel');
const puppeteer = require('puppeteer');

puppeteer.launch({headless: true, args: ['--no-sandbox']}).then(guzel);

const guzel = require('guzel');
const puppeteer = require('puppeteer');

puppeteer.launch({headless: true}).then(guzel);

const guzel = require('guzel');
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  await guzel(browser);

  const page = await browser.newPage();
  await page.goto('https://unixpapa.com/js/testmouse.html');
};

run().catch(console.error);
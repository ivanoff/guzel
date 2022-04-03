# guzel

## guzel - remote headless puppetter watcher

**güzel** /ɟy.zɛl/, *adj* (Turkish) - beautiful

If you want to connect to headless puppetter, you don't need to change your code at all. Just add the following line for guzel activation!

```
guzel(browser);
```

Then open `http://localhost:3208` to control your puppetter browser.

## Instalation

```
npm i -S gusel
```

## Usage

```
const guzel = require('guzel');
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  # just add this line for guzel activation!
  await guzel(browser);

  # you don't need to change the rest of your code at all!
  const page = await browser.newPage();
  await page.goto('https://unixpapa.com/js/testmouse.html');
};

run().catch(console.error);
```
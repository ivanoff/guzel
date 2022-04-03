# guzel - remote headless puppetter watcher

**güzel** /ɟy.zɛl/, *adj* (Turkish) - beautiful

If you want to **connect to headless puppetter**, you don't need to change your code at all. Just add the following lines for guzel activation!

```javascript
const guzel = require('guzel');

// const browser = await puppeteer.launch...

guzel(browser);
```

Then open `http://localhost:3208` to control your puppetter browser.

## Demo

![guzel demo](./static/demo.gif)

## Instalation

```
npm i -S gusel
```

## Usage

```javascript
const guzel = require('guzel');

//...

const browser = await puppeteer.launch({ headless: true });

// just add the following line -->
await guzel(browser);

//...
```

## Remote browser

You can run **guzel** on remote server (ex. `your-server.com`)

```ssh
ssh your-server.com
git clone git@github.com:ivanoff/guzel.git
cd guzel/example
sudo docker-compose up
```

Then open `your-server.com:3208` and start surfing with your **guzel puppetter**

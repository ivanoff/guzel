const path = require('path');
const express = require('express');
const app = express();
const port = 3208;

class Guzel {
  constructor(browser, { functions } = {}) {
    this.browser = browser;
    this.pageLogs = [];
    this.logPuppeteer = () => this.log();
    this.functions = functions || {};
  }

  log(id, type, text) {
    if(!id) return;
    if(!this.pageLogs[id]) this.pageLogs[id] = {};
    if(!this.pageLogs[id][type]) this.pageLogs[id][type] = [];
    this.pageLogs[id][type].push(text);
  }

  checkPagesProperties() {
    for(let i = 0; i < this.pages.length; i++) {
      if(this.pages[i]._hasOnRequest) continue;

      this.pages[i]._hasOnRequest = true;
      this.pages[i].on('request', request => {
        this.log(i, 'requests', request.url());
      });
      this.pages[i]._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: `downloads`});
    }
  }

  initApp() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    app.use('/pages/:id', (req, res, next) => {
      const { id } = req.params;
      this.page = this.pages[+id];
      this.logPuppeteer = text => this.log(id, 'puppeteer', text);
      next(!this.page && 'Page not found');
    });

    app.get('/pages', async (req, res) => {
      this.pages = await this.browser.pages();
      this.checkPagesProperties();
      try {
        const result = await Promise.all(
          this.pages.map(async page => ({
            title: await page.title(),
            url: page.url(),
            html: await page.evaluate(() => document.querySelector('*').outerHTML),
          }))
        );
        for(let i = 0; i < result.length; i++) {
          result[i].logs = this.pageLogs[i];
        }
        res.json(result);
      } catch(err) {
        res.json([{ title:'Loading...', url:'' }]);
      }
    });

    app.post('/pages', async (req, res) => {
      await this.browser.newPage();
      res.end();
    });

    app.get('/pages/:id/url', (req, res) => {
      res.end(this.page.url());
    });

    app.get('/pages/:id/close', async (req, res) => {
      await this.page.close();
      this.logPuppeteer(`await page.close();`);
      res.end();
    });

    app.post('/pages/:id/url', async (req, res) => {
      const { url } = req.body;
      try {
        const u = url.match(/^https?:\/\//) ? url : `http://${url}`;
        await this.page.goto(u);
        this.logPuppeteer(`await page.goto('${u}');`);
      } catch(err) {
        console.error(err);
      }
      res.end();
    });

    app.get('/pages/:id/back', async (req, res) => {
      await this.page.goBack();
      this.logPuppeteer(`await page.goBack();`);
      res.end();
    });

    app.get('/pages/:id/forward', async (req, res) => {
      await this.page.goForward();
      this.logPuppeteer(`await page.goForward();`);
      res.end();
    });

    app.get('/pages/:id/reload', async (req, res) => {
      await this.page.reload();
      this.logPuppeteer(`await page.reload();`);
      res.end();
    });

    app.get('/pages/:id/scroll', async (req, res) => {
      await this.page.mouse.wheel({ deltaY: +req.query.y });
      this.logPuppeteer(`await page.mouse.wheel({ deltaY: ${+req.query.y} });`);
      res.end();
    });

    app.get('/pages/:id/click', async (req, res) => {
      const { x, y } = req.query;
      await this.page.mouse.click(+x, +y);
      this.logPuppeteer(`await page.mouse.click(${+x}, ${+y});`);
      res.end();
    });

    app.get('/pages/:id/press', async (req, res) => {
      try {
        if(req.query.key.length > 1) {
          await this.page.keyboard.press(req.query.key);
          this.logPuppeteer(`await page.keyboard.press('${req.query.key}');`);
        } else {
          await this.page.keyboard.type(req.query.key);
          this.logPuppeteer(`await page.keyboard.type('${req.query.key}');`);
        }
      } catch(err) {
        console.error(err);
      }
      res.end();
    });

    app.get('/pages/:id/image.jpg', async (req, res) => {
      try {
        const data = await this.page.screenshot({
          type: 'jpeg',
          quality: 80,
          omitBackground: false,
        });
        res.contentType('image/jpeg');
        res.end(data, 'binary');
      } catch(err) {
        console.error(err);
        res.end();
      }
    });

    app.get('/functions', async (req, res) => {
      res.json(Object.keys(this.functions));
    });

    app.get('/functions/:name', async (req, res) => {
      const { name } = req.params;
      this.logPuppeteer(`await ${name}();`);
      if(typeof this.functions[name] === 'function') {
        await this.functions[name]({ page: this.page, browser: this.browser });
      }
      res.end();
    });

    app.listen(port, async () => {
      console.log(`started on ${port}`);
    });
  }

  async init() {
    this.pages = await this.browser.pages();
    this.checkPagesProperties();
    this.initApp()
  }
}

module.exports = async (browser, options) => {
  const eye = new Guzel(browser, options);
  await eye.init()
}

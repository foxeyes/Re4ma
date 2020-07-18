import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import liveServer from 'live-server';

let __dirname = path.resolve(path.dirname(''));
console.log('Current path: ' + __dirname);

let cfgPath = __dirname + '/re4ma.cfg.json';

console.log(cfgPath)

if (!fs.existsSync(cfgPath)) {
  console.log('Re4ma: no cfg file located...');
  process.exit();
}

/**
 * @typedef RenderEntry
 * @property {String} source
 * @property {String} output
 * @property {Boolean} [scanLinks]
 * @property {Array<String>} [flags]
 * @property {Array<String>} [exclude]
 */

class Cfg {
  /**
   *
   * @param {Object} [src]
   * @param {Number} [src.port]
   * @param {Array<RenderEntry>} src.renderItems
   * @param {Boolean} [src.minify]
   */
  constructor(src) {
    this.port = src.port || 3000;
    this.renderItems = src.renderItems || [];
    this.minify = src.minify !== undefined ? src.minify : true;
  }
}

let cfg = new Cfg(JSON.parse(fs.readFileSync(cfgPath, 'utf8').toString()));
console.log(cfg);

liveServer.start({
  port: cfg.port,
  root: __dirname + '/', // Set root directory that's being served. Defaults to cwd.
  ignore: '.', // ignore files for detect changes (. - means all ignore)
  open: false, // When false, it won't load your browser by default.
});

function min(html) {
  while (html.includes('\n')) {
    html = html.split('\n').join('');
  }
  while (html.includes('> ')) {
    html = html.split('> ').join('>');
  }
  while (html.includes('  ')) {
    html = html.split('  ').join(' ');
  }
  return html;
}

async function build() {
  let browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-web-security',
    ],
    headless: true,
  });
  let page = await browser.newPage();
  await page.setBypassCSP(true);

  let allEntries = new Set();

  let scan = async (renderItems) => {
    for (let renderDesc of renderItems) {
      let srcPath = __dirname + '/' + renderDesc.source;
      let outPath = __dirname + '/' + renderDesc.output;
      let files = fs.readdirSync(srcPath);
      for (let i = 0; i < files.length; i++) {
        let fileName = files[i];
        let skip = renderDesc.exclude && fileName.includes(fileName);
        if (!skip && (fileName.includes('.html') || fileName.includes('.HTML'))) {
          await page.goto(`http://localhost:${cfg.port}/${renderDesc.source + fileName}`, {
            waitUntil: 'networkidle0',
          });
          await page.waitFor(200);
          await page.evaluate(() => {
            let elToRemoveArr = [...document.querySelectorAll('[re-move]')];
            elToRemoveArr.forEach((el) => {
              el.remove();
            });
            let elToClearArr = [...document.querySelectorAll('[re-clear]')];
            elToClearArr.forEach((el) => {
              el.textContent = '';
              el.removeAttribute('style');
              el.removeAttribute('re-clear');
            });
          });
          if (renderDesc.scanLinks) {
            let links = await page.evaluate(() => {
              return [...document.querySelectorAll('a')].map((a) => {
                return a.getAttribute('href');
              });
            });
            allEntries = new Set([...allEntries, ...links]);
          }
          let html = await page.evaluate(() => {
            return document.documentElement.outerHTML;
          });
          if (cfg.minify) {
            html = min(html);
          }
          console.log(`Ready: ${outPath + fileName}`);
          if (!fs.existsSync(outPath)) {
            fs.mkdirSync(outPath, {
              recursive: true,
            });
          }
          fs.writeFileSync(outPath + fileName, html);
        }
      }
    }
  };

  await scan(cfg.renderItems);

  console.log([...allEntries]);

  process.exit();
}

build().then(() => {
  liveServer.shutdown();
});

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import localhost from 'localhost';

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

localhost(__dirname + '/').listen(cfg.port);

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

  for (let renderDesc of cfg.renderItems) {
    let files = fs.readdirSync(__dirname + '/' + renderDesc.source);
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i];
      let skip = renderDesc.exclude && fileName.includes(fileName);
      if (!skip && (fileName.includes('.html') || fileName.includes('.HTML'))) {
        await page.goto(`http://localhost:${cfg.port}/${renderDesc.source}/${fileName}`, {
          waitUntil: 'networkidle0',
        });
        let html = await page.evaluate(() => {
          let elToRemoveArr = [...document.querySelectorAll('[re-move]')];
          elToRemoveArr.forEach((el) => {
            el.remove();
          });
          return document.documentElement.outerHTML;
        });
        if (cfg.minify) {
          html = min(html);
        }
        console.log(`Ready: ${fileName}`);
        if (!fs.existsSync(__dirname + '/' + renderDesc.output)) {
          fs.mkdirSync(__dirname + '/' + renderDesc.output, {
            recursive: true,
          });
        }
        fs.writeFileSync(__dirname + `/${renderDesc.output}/${fileName}`, html);
      }
    }
  }
  process.exit();
}

build();

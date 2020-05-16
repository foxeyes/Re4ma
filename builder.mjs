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

class Cfg {
  /**
   *
   * @param {Object} [src]
   * @param {Number} [src.port]
   * @param {String} [src.sourceFolder]
   * @param {String} [src.outputFolder]
   * @param {Boolean} [src.minify]
   * @param {Array<String>} [src.files]
   */
  constructor(src = {}) {
    this.port = src.port || 3000;
    this.sourceFolder = src.sourceFolder || './html';
    this.outputFolder = src.outputFolder || './dist';
    this.minify = src.minify !== undefined ? src.minify : true;
    this.files = src.files || [
      'index.html',
    ];
  }
}

let cfg = new Cfg(JSON.parse(fs.readFileSync(cfgPath, 'utf8').toString()));
console.log(cfg);

localhost(__dirname + '/').listen(3000);

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

  for (let fileName of cfg.files) {
    await page.goto(`http://localhost:${cfg.port}/${cfg.sourceFolder}/${fileName}`, {
      waitUntil: 'networkidle0',
    });

    let html = await page.evaluate(() => {
      let sriptToRemove = document.querySelector('script[remove]');
      if (sriptToRemove) {
        sriptToRemove.remove();
      }
      return document.documentElement.outerHTML;
    });
    if (cfg.minify) {
      html = min(html);
    }
    console.log(html);
    fs.writeFileSync(`./${cfg.outputFolder}/${fileName}`, html);
  }

  process.exit();
}

build();

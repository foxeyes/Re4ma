import puppeteer from 'puppeteer';
import fs from 'fs';

function min(html) {
  while (html.includes('\n')) {
    html = html.split('\n').join('');
  }
  while (html.includes('  ')) {
    html = html.split('  ').join(' ');
  }
  while (html.includes('> ')) {
    html = html.split('> ').join('>');
  }
  return html;
}

async function build() {
  let browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--allow-file-access-from-file',
      '--disable-web-security',
    ],
    headless: true,
  });
  let page = await browser.newPage();
  await page.setBypassCSP(true);
  page.on('console', (msg) => {
    console.log(msg.text());
  });

  await page.goto('http://127.0.0.1:5500/test/index.html', {
    waitUntil: 'networkidle0',
  });

  let html = await page.evaluate(() => {
    return document.documentElement.outerHTML;
  });
  html = html.split('<!-- Code injected by live-server -->')[0] + '</body></html>';
  html = min(html);
  fs.writeFileSync('./dist/index.html', html);

  process.exit();
}

build();

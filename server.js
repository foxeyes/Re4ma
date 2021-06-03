import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

const MIME_MAP = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.zip': 'application/zip',
};

export class ReServer {

  constructor(port = 9000) {
    this.port = port;
    this._server = http.createServer((request, response) => {
      let parsedUrl = url.parse(request.url);
      let filePath = '.' + parsedUrl.pathname;
      let fileExt = path.parse(filePath).ext;
      fs.stat(filePath, {bigint: false}, (err, stat) => {
        if (err) {
          response.statusCode = 404;
          response.end('File not found: ' + filePath);
          return;
        } 
        if (fs.statSync(filePath).isDirectory()) {
          filePath += 'index.html';
          fileExt = '.html';
        }
        if (filePath)
        fs.readFile(filePath, {}, (err, /** @type {Buffer | String} */ data) => {
          if (err) {
            console.log(filePath);
            response.statusCode = 500;
            response.end('Internal Server Error');
            return;
          }
          response.setHeader('Content-type', MIME_MAP[fileExt] || 'text/plain');
          if (fileExt === '.html') {
            let html = data.toString().trim();
            if (html.indexOf('<re-htm ') === 0) {
              let rel = (base = false) => {
                let result = '';
                let length = filePath.split('/').length;
                for (let i = 0; i < (base ? length - 3 : length); i++) {
                  result += '../';
                }
                return result;
              };
              data = `<!DOCTYPE html><script src="${rel()}re4ma/render/render.js" type="module"></script><base href="./${rel(true)}" />` + html;
            }
          }
          response.end(data);
        });
      });
    });
  }

  start() {
    this._server.listen(this.port);
  }

  stop() {
    this._server.close((err) => {
      console.log(err);
    });
  }

}
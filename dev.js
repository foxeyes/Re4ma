import { ReServer } from './server.js';

let server = new ReServer(5000);
server.start();

console.log('http://localhost:5000/src/index.html');
export {ReHtm} from './re-htm.js';
export {ReScript} from './re-script.js';
export {ReMd} from './re-md.js';

window.addEventListener('keyup', (e) => {
  if (e.altKey && e.key === 's') {
    e.preventDefault();
    [...document.querySelectorAll('[to-remove]')].forEach((el) => {
      el.remove();
    });
    let html
  }
})

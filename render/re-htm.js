const IMPORTS_READY = 'imports-ready';

const CACHE = Object.create(null);

const ATTR_PRFX = '--';

function uid() {
  let allSymbolsStr = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
  let variety = allSymbolsStr + allSymbolsStr;
  return 'XXXXXX'.replace(/[X]/g, () => {
    let rnd = Math.floor( Math.random() * (variety.length - 1) );
    let symbol = variety.substring(rnd, rnd + 1);
    return symbol;
  });
};

export class ReHtm extends HTMLElement {

  constructor() {
    super();
    ReHtm.instances.push(this);
  }

  _processFr(fr) {
    return fr;
  }

  /**
   * @param {String} src
   */
  set src(src) {

    let importHtml = async () => {
      if (!CACHE[src]) {
        CACHE[src] = {
          uid: null,
          html: null,
          new: true,
        }
      }
      let cached = CACHE[src];
      if (!cached.uid) {
        cached.uid = uid();
      }
      if (!cached.html) {
        cached.html = await (await window.fetch(src)).text();
      };
      let html = cached.html;
      [...this.attributes].forEach((attr) => {
        if (attr.name.startsWith(ATTR_PRFX)) {
          let name = attr.name.replace(ATTR_PRFX, '');
          html = html.split(`{{${name}}}`).join(attr.value);
        }
      });
      let tpl = document.createElement('template');
      tpl.innerHTML = html;
      let fr = document.createDocumentFragment();
      fr.appendChild(tpl.content);
      let head = fr.querySelector('re-head');
      if (head) {
        [...head.children].forEach((node) => {
          console.log(node)
          document.head.appendChild(node);
        });
        head.remove();
      }
      let defaultSlot = fr.querySelector(`slot:not([name])`);
      let slot;
      [...this.children].forEach((el) => {
        let slotName = el.getAttribute('slot');
        if (slotName) {
          slot = fr.querySelector(`slot[name="${slotName}"]`);
        }
        if (!slot) {
          slot = defaultSlot || null;
        }
        if (slot) {
          slot.parentElement?.insertBefore(el, slot);
        } else {
          el.remove();
        }
      });
      [...fr.querySelectorAll('slot')].forEach((slot) => {
        slot.remove();
      });
      this.parentElement.insertBefore(this._processFr(fr), this);
      this.remove();
      ReHtm.processed.push(this);
      if (ReHtm.instances.length === ReHtm.processed.length) {
        window.dispatchEvent(new CustomEvent(IMPORTS_READY));
        window.requestAnimationFrame(() => {
          [...document.querySelectorAll('[re-move]')].forEach((el) => {
            el.remove();
          });
        });
      }
    }
    importHtml();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return;
    }
    this[name] = newVal;
  }

}
ReHtm.observedAttributes = ['src'];
ReHtm.instances = [];
ReHtm.processed = [];
window.customElements.define('re-htm', ReHtm);

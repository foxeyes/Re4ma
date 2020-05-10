const IMPORTS_READY = 'imports-ready';

let documentStyle = null;

/**
 *
 * @param {String} string
 * @param {'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'} [algorithm]
 *
 */
export async function hashIt(string, algorithm='SHA-1') {
  let encoder = new TextEncoder();
  let resultArrBuff = await window.crypto.subtle.digest(algorithm, encoder.encode(string));
  let hashArr = Array.from(new Uint8Array(resultArrBuff)).map((b) => {
    return b.toString(16);
  });
  return hashArr.join('');
};

export class ImportHtml extends HTMLElement {

  constructor() {
    super();
    ImportHtml.instances.push(this);
  }

  _processFr(fr) {
    return fr;
  }

  set src(src) {
    let importHtml = async () => {
      let prefix = (await hashIt(src)).substring(0, 6);
      let html = await (await window.fetch(src)).text();
      [...this.attributes].forEach((attr) => {
        html = html.split(`--${attr.name}--`).join(attr.value);
      });
      let tpl = document.createElement('template');
      tpl.innerHTML = html;
      let fr = document.createDocumentFragment();
      fr.appendChild(tpl.content);
      let classList = [];
      let styledElArr = [...fr.querySelectorAll('[class]')];
      styledElArr.forEach((el) => {
        classList = [...classList, ...el.classList];
        [...el.classList].forEach((className) => {
          el.classList.replace(className, '_' + prefix + '_' + className);
        });
      });
      let tplStyles = [...fr.querySelectorAll('style')];
      if (tplStyles.length) {
        if (!documentStyle) {
          documentStyle = document.querySelector('style');
        }
        if (!documentStyle) {
          documentStyle = document.createElement('style');
          document.head.appendChild(documentStyle);
        }
        tplStyles.forEach((tplStyle) => {
          classList.forEach((className) => {
            tplStyle.innerHTML = tplStyle.innerHTML.replace(className, '_' + prefix + '_' + className);
          });
          documentStyle.innerHTML += tplStyle.innerHTML;
          tplStyle.remove();
        });
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
          slot.parentElement.insertBefore(el, slot);
        } else {
          el.remove();
        }
      });
      if (slot) {
        // @ts-ignore
        slot.remove();
      }
      this.parentElement.insertBefore(this._processFr(fr), this);
      this.remove();
      ImportHtml.propcessed.push(this);
      if (ImportHtml.instances.length === ImportHtml.propcessed.length) {
        window.dispatchEvent(new CustomEvent(IMPORTS_READY));
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
ImportHtml.observedAttributes = ['src'];
ImportHtml.instances = [];
ImportHtml.propcessed = [];
window.customElements.define('import-html', ImportHtml);

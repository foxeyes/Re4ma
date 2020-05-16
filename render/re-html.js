const IMPORTS_READY = 'imports-ready';

let documentStyle = null;

function uid() {
  let allSymbolsStr = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
  let variety = allSymbolsStr + allSymbolsStr;
  return 'XXXXXXXX'.replace(/[X]/g, () => {
    let rnd = Math.floor( Math.random() * (variety.length - 1) );
    let symbol = variety.substring(rnd, rnd + 1);
    return symbol;
  });
};

export class ReHtml extends HTMLElement {

  constructor() {
    super();
    ReHtml.instances.push(this);
  }

  _processFr(fr) {
    return fr;
  }

  set src(src) {

    let importHtml = async () => {
      let srcid = uid();
      let proptectClassName = (name) => {
        return name + '_' + srcid;
      };
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
          el.classList.replace(className, proptectClassName(className));
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
            tplStyle.innerHTML = tplStyle.innerHTML.replace(className, proptectClassName(className));
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
      ReHtml.propcessed.push(this);
      if (ReHtml.instances.length === ReHtml.propcessed.length) {
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
ReHtml.observedAttributes = ['src'];
ReHtml.instances = [];
ReHtml.propcessed = [];
window.customElements.define('re-html', ReHtml);

import marked from '../node_modules/marked/lib/marked.esm.js';

export class ImportMd extends HTMLElement {

  set src(src) {
    let importMd = async () => {
      let md = await (await window.fetch(src)).text();
      this.outerHTML = marked(md);
    };
    importMd();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return;
    }
    this[name] = newVal;
  }

}
ImportMd.observedAttributes = ['src'];
window.customElements.define('import-md', ImportMd);

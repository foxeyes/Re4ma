import marked from '../node_modules/marked/lib/marked.esm.js';

export class ReMd extends HTMLElement {

  set src(src) {
    let ReMd = async () => {
      let md = await (await window.fetch(src)).text();
      this.outerHTML = marked(md);
    };
    ReMd();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return;
    }
    this[name] = newVal;
  }

}
ReMd.observedAttributes = ['src'];
window.customElements.define('re-md', ReMd);

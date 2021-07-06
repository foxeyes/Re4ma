export class ReCss extends HTMLElement {

  constructor() {
    super();
    this.src = null;
  }

  connectedCallback() {
    if (this.src) {
      console.log(this.src);
      let style = document.createElement('link');
      style.href = this.src;
      style.rel = 'stylesheet';
      document.head.appendChild(style);
    }
    this.remove();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return;
    }
    this[name] = newVal;
  }

}

ReCss.observedAttributes = [
  'src',
];

window.customElements.define('re-css', ReCss);
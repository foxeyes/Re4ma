export class ReJs extends HTMLElement {
  set src(src) {
    let script = document.createElement('script');
    script.src = src;
    let iSmodule = this.getAttribute('module');
    if (iSmodule === 'true' || iSmodule === '') {
      script.setAttribute('type', 'module');
    }
    document.body.appendChild(script);
    this.remove();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return;
    }
    this[name] = newVal;
  }
}
ReJs.observedAttributes = ['src', 'module'];
window.customElements.define('re-js', ReJs);

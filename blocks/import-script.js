export class ImportScript extends HTMLElement {
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
ImportScript.observedAttributes = ['src', 'module'];
window.customElements.define('import-script', ImportScript);

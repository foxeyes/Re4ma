import marked from '../node_modules/marked/lib/marked.esm.js';

export class ReMd extends HTMLElement {

  _colorize(srcCode) {
    srcCode = srcCode
      .replace(/;/g, '&semi;') // must be on a first place
      .replace(/\//g, '&sol;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // if (!this.hasAttribute('highlight')) {
    //   return srcCode;
    // }
    let hlChars = [
      '=',
      '#',
      '$',
      '|',
      '{',
      '}',
      `'`,
      '`',
      `:`,
      `.`,
      `,`,
      `(`,
      `)`,
      `[`,
      `]`,
      '&lt;&sol;',
      '&lt;',
      '&gt;',
      '&semi;',
      '&quot;',
    ];
    hlChars.forEach((char) => {
      srcCode = srcCode.split(char).join(`<span class="hl">${char}</span>`);
    });

    srcCode = srcCode
      .split('&sol;*').join('<span class="comment">&sol;*')
      .split('*&sol;').join('*&sol;</span>')
      .split('&sol;&sol; ').map((subStr, idx) => {
        return idx ? subStr.replace('\n', '</span>\n') : subStr;
      }).join('<span class="comment">&sol;&sol; ');
    return srcCode;
  }

  set src(src) {
    let ReMd = async () => {
      let md = await (await window.fetch(src)).text();
      let html = marked(md);
      let fr = document.createDocumentFragment();
      let wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      fr.appendChild(wrapper);
      let codeBlocks = [...fr.querySelectorAll('code')];
      codeBlocks.forEach((code) => {
        code.innerHTML = this._colorize(code.textContent);
      });
      this.outerHTML = wrapper.innerHTML;
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

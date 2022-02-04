const template = `
<style>
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    background-color: rgba(0,0,0,.85);
    z-index: 2;
    overflow: auto;
    animation: fade-in .2s both ease-out;
  }

  section {
    position: relative;
    background-color: var(--darker-gray);
    padding: 48px var(--padding) var(--padding);
  }

  .btn-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 30px;
    height: 30px;
    padding: 6px;
    outline: none;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    color: white;
    background: black;
  }

  @keyframes fade-in{
    from{
      background-color: rgba(0,0,0,0);;
    }
  }
</style>

<section>
  <slot></slot>
  <button class="btn-close" title="Close">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path fill="currentColor" d="m207.6 256 107.72-107.72a15.98 15.98 0 0 0 0-22.58l-25.03-25.03a15.98 15.98 0 0 0-22.58 0L160 208.4 52.28 100.68a15.98 15.98 0 0 0-22.58 0L4.68 125.7a15.98 15.98 0 0 0 0 22.58L112.4 256 4.68 363.72a15.98 15.98 0 0 0 0 22.58l25.03 25.03a15.98 15.98 0 0 0 22.58 0L160 303.6l107.72 107.72a15.98 15.98 0 0 0 22.58 0l25.03-25.03a15.98 15.98 0 0 0 0-22.58L207.6 256z"/>
    </svg>
  </button>
</section>
`

class DialogBox extends HTMLElement {
  connectedCallback() {
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = template
    this.addEventListener('click', this)
  }

  handleEvent(e) {
    switch (true) {
      case e.target === this:
      case e.target.matches('.btn-close'):
        this.remove()
        break
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this)
  }
}

customElements.define('dialog-box', DialogBox)

class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      main{
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
        margin: 0;
        padding: 0;
        font-family: inherit;
        background-color: hsl(0, 0%, 22%);
        color: inherit; 
      }
    </style>

    <main>
      <div class="main-column">
        <slot name="left-column"></slot>
      </div>
      <div class="main-column">
        <slot name="right-column"></slot>
      </div>
    </main>
  `
  }
}

customElements.define('main-component', Main)

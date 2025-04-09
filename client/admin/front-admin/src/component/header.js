class Header extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback() {
    await this.render()
  }

render() {
  this.shadow.innerHTML =
  /*html*/`
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
      .menu {
          display: flex;
          justify-content: space-between;
          background-color: hsl(0, 0%, 14%);
          height: 4.5rem;
        }
        .menuTitle {
          align-content: center;
          color: hsl(0, 0%, 100%);
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          text-transform: uppercase;
          padding: 1rem;
        }
        .menu-btn {
          background: none;
          border: none;
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .menu-btn svg {
          width: 30px;
          height: 30px;
          color: hsl(0, 0%, 100%);
        }
    </style>

    <header class="menu">
      <slot name="menu"></slot>
    </header>

  `
  }
}

customElements.define('header-component', Header)

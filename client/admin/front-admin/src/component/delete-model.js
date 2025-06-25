class DeleteModel extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    document.addEventListener('show-delete-modal', this.handleMessage.bind(this))
  }

  connectedCallback () {
    this.render()
  }

  handleMessage (event) {
    const modal = this.shadow.querySelector('.alertDelete')
    if (modal) {
      modal.classList.add('active')
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        h2, h3, button {
          font-family: 'Open Sans', sans-serif;
          font-weight: 500;
          margin: 0;
          padding: 0;
          justify-self: center;
        }

        .alertDelete {
          background-color: rgba(0, 0, 0, 0.5);
          height: 100vh;
          width: 100%;
          position: fixed;
          z-index: 10;
          align-content: center;
          top: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
          display: grid;
        }

        .alertDelete.active {
          opacity: 1;
          visibility: visible;
        }

        .alert {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: white;
          width: max-content;
          border-radius: 1rem;
          justify-self: center;
          justify-content: center;
          padding: 2rem;
        }

        .title h2 {
          font-size: 2rem;
          font-weight: 700;
        }

        .buttons {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }

        button {
          margin-top: 3rem;
          padding: 1em 2rem;
          color: black;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 2rem;
          border: none;
          cursor: pointer;
        }

        button:hover {
          transform: scale(1.05);
        }

        .buttonYes {
          background-color: hsl(0, 100%, 65.1%);
          color: white;
        }

        .buttonNo {
          background-color: hsl(120, 94.4%, 42.2%);
          color: white;
        }
      </style>

      <section class="alertDelete">
        <div class="alert">
          <div class="title">
            <h2>¿Estás seguro de eliminar registro?</h2>
          </div>
          <div class="subtitle">
            <h3>Se eliminará el registro y no se podrá recuperar</h3>
          </div>
          <div class="buttons">
            <div class="yes">
              <button class="buttonYes" type="button">Eliminar</button>
            </div>
            <div class="no">
              <button class="buttonNo" type="button">Cancelar</button>
            </div>
          </div>
        </div>
      </section>
    `

    const buttonYes = this.shadow.querySelector('.buttonYes')
    const buttonNo = this.shadow.querySelector('.buttonNo')
    const modal = this.shadow.querySelector('.alertDelete')

    buttonYes?.addEventListener('click', () => {
      modal.classList.remove('active')
      this.dispatchEvent(new CustomEvent('confirm-delete', { bubbles: true, composed: true }))
    })

    buttonNo?.addEventListener('click', () => {
      modal.classList.remove('active')
    })
  }
}

customElements.define('delete-model-component', DeleteModel)

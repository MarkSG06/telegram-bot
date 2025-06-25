class Form extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* SECTION FORM */
        .toolbar {
          margin-top: 1rem;
          width: 95%;
          height: 3rem;
          justify-self: center;
          display: flex;
          gap: 1rem;
          align-items: center;
          background-color: hsl(0, 0%, 100%);
          padding-right: 1rem;
        }

        .toolbarSVGs {
          display: flex;
          gap: 1rem;
          margin-left: auto;
        }

        .toolbarSVGs svg {
          width: 30px;
          height: 30px;
          cursor: pointer;
          color: hsl(271, 76%, 53%);
        }
        /* ESTILO BOTON GENERAL TOOLBAR */
        .tabs span{
          background-color: hsl(271, 76%, 53%);
          padding: 0.95rem;
          height: auto;
          color: hsl(0, 0%, 100%);
          font-weight: 600;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }
        /* SECTION MAIN */
        .sectionMain{
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
          gap:1rem;
        }
        .sectionMain form {
          justify-self: center;
          width: 95%;
          display: flex;
          gap: 2rem; 
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          flex: 1; 
        }

        .sectionMain input {
          padding: 0.5rem;
          border-radius: 5px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          border: none;
          width: 100%;
        }
        .sectionMain label{
          color: hsl(0, 0%, 100%);
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          padding: 1rem 0 1rem 0;
        }

      </style>
      <div class="sectionForm">
        <div class="toolbar">
          <div class="tabs">
            <span>General</span>
          </div>
          <div class="toolbarSVGs">
            <div class="clear-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
                <path fill="none" stroke="#000000" stroke-width="2"
                  d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z 
                    M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z 
                    M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"/>
              </svg>
            </div>
            <div class="save-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 32 32">
                <path fill="none" stroke="#000000" stroke-width="2"
                  d="M4 4 H28 V28 H4 Z
                    M10 4 V12 H22 V4
                    M10 28 V20
                    M16 28 V20
                    M22 28 V20" />
              </svg>
            </div>
          </div>
        </div>
        <div class="sectionMain">
          <form>
            <div class="fieldGroup">
              <label for="name">Nombre</label>
              <input type="text" id="name" name="name">
            </div>
            <div class="fieldGroup">
              <label for="email">Email</label>
              <input type="text" id="email" name="email">
            </div>
          </form>
        </div>
      </div>
    `

    this.renderSaveButton()
  }

  renderSaveButton () {
    this.shadow.querySelector('.save-button').addEventListener('click', async event => {
      event.preventDefault()

      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      try {
        const method = 'POST'

        const response = await fetch('/api/admin/users', {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataJson)
        })

        if (!response.ok) {
          throw new Error(`Error al guardar los datos: ${response.statusText}`)
        }

        const data = await response.json()

        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'Datos guardados correctamente',
            type: 'success'
          }
        }))
      } catch (error) {
        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'No se han podido guardar los datos',
            type: 'error'
          }
        }))
        console.error('Error al guardar los datos:', error)
      }
    })
  }
}

customElements.define('form-component', Form)

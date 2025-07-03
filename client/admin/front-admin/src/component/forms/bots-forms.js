import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable, showFormElement } from '../../redux/crud-slice.js'

class BotForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
    <style>
      /* RESET GENERAL */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Nunito Sans", serif;
      }

      /* TOOLBAR */
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 2rem;
        padding-right: 1rem;
        border-radius: 5px;
        background-color: hsl(0, 0%, 100%);
      }

      .toolbarSVGs {
        display: flex;
        gap: 1rem;
        padding: 0 0.5rem;
      }

      .toolbarSVGs svg {
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        color: hsl(271, 76%, 53%);
      }

      .tabs {
        display: flex;
        height: 100%;
      }

      /* BOTONES TOOLBAR */
      .tab {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 0.5rem;
        cursor: pointer;
        color: hsl(271, 76%, 53%);
        font-weight: 600;
      }

      .active-tab {
        color: hsl(0, 0%, 100%);
        background-color: hsl(271, 76%, 53%);
      }

      /* CONTENIDO DE TABS */
      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
        justify-self: center;
        width: 95%;
      }

      /* SECCIÓN PRINCIPAL */
      .sectionMain input {
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }

      .sectionMain label {
        padding: 1rem 0;
        color: hsl(0, 0%, 100%);
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }

      .upFieldGroup {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .fieldGroup {
        display: flex;
        flex-direction: column;
        flex: 1;
        font-weight: 400;
        font-size: 16px;
      }

      .subdata {
        width: 100%;
      }

      /* BOTÓN CON TOOLTIP */
      .button {
        position: relative;
        display: flex;
        align-items: center;
      }

      .tooltip {
        position: absolute;
        z-index: 10;
        background-color: #4f46e5;
        color: #ffffff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: nowrap;
        transform: translateY(-120%);
        margin-bottom: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .button:hover .tooltip {
        opacity: 1;
      }

      /* VALIDACIONES */
      .v-active input {
        border: 1px solid red;
        background-color: rgb(255, 225, 143);
      }

      .validation-errors {
        display: none;
        position: relative;
        margin-top: 1rem;
        padding: 2rem 1rem;
        background-color: #585858;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 0.5rem;
      }

      .validation-errors.active {
        display: block;
      }

      .validation-errors ul {
        list-style: none;
      }

      .validation-errors p {
        font-weight: 700;
        font-size: 1.2rem;
      }

      .validation-errors .close-validation-errors {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        cursor: pointer;
      }

      .close-validation-errors svg {
        width: 2rem;
        height: 2rem;
        fill: hsl(100, 100%, 100%);
      }
      .fieldGroup textarea{
        padding: 0.5rem;
        max-width: 100%;
        height: 10rem;
        resize: none;
        font-weight: 400;
        font-size: 16px;
        border-radius: 5px;
      }
    </style>

      <div class="form">
        <div class="toolbar">
          <div class="tabs">
            <div class="tab active-tab" data-tab="general">
              <span>General</span>
            </div>
          </div>
          <div class="toolbarSVGs">
            <div class="button clean-button">
              <span class="tooltip">Limpiar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
                <path fill="none" stroke="#000000" stroke-width="2"
                  d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z 
                    M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z 
                    M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"/>
              </svg>
            </div>
            <div class="button save-button">
              <span class="tooltip">Guardar</span>
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
          <div class="validation-errors">
            <p>Error en la validación, revisa los siguientes errores: </p>
            <ul></ul>
            <div class="button close-validation-errors">
              <span class="tooltip">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
            </div>
          </div>
          <form>
            <input type="hidden" name="id">
            <div class="tab-content active" data-tab="general">
              <div class="upFieldGroup active">
                <div class="fieldGroup">
                  <label for="platform">Plataforma</label>
                  <input type="text" id="platform" name="platform">
                </div>
                <div class="fieldGroup">
                  <label for="name">Nombre</label>
                  <input type="text" id="name" name="name">
                </div>
              </div>
              <div class="downFieldGroup">
                <div class="fieldGroup">
                  <label for="token">Token</label>
                  <input type="text" id="token" name="token">
                </div>
                <div class="fieldGroup">
                  <label for="description">Descripción</label>
                  <textarea id="description" name="description"></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    })

    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()

      if (event.target.closest('.save-button')) {
        const form = this.shadow.querySelector('form')
        const formDataJson = {}

        for (const [key, value] of new FormData(form).entries()) {
          formDataJson[key] = value !== '' ? value : null
        }

        const id = this.shadow.querySelector('[name="id"]').value
        const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
        const method = id ? 'PUT' : 'POST'
        delete formDataJson.id

        try {
          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataJson)
          })

          if (!response.ok) throw response

          store.dispatch(showFormElement({
            endPoint: this.endpoint,
            data: null
          }))

          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()

          document.dispatchEvent(new CustomEvent('notice', {
            detail: { message: 'Datos guardados correctamente', type: 'success' }
          }))
        } catch (error) {
          if (error.status === 422) {
            const data = await error.json()
            this.showValidationErrors(data.message)

            document.dispatchEvent(new CustomEvent('notice', {
              detail: { message: 'Hay errores de validación', type: 'error' }
            }))
          } else if (error.status === 500) {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: { message: 'No se han podido guardar los datos', type: 'error' }
            }))
          }
        }
      }

      if (event.target.closest('.tab')) {
        const clickedTab = event.target.closest('.tab')

        this.shadow.querySelector('.tab.active-tab')?.classList.remove('active-tab')
        clickedTab.classList.add('active-tab')

        this.shadow.querySelector('.tab-content.active')?.classList.remove('active')
        this.shadow.querySelector(`.tab-content[data-tab='${clickedTab.dataset.tab}']`).classList.add('active')
      }

      if (event.target.closest('.clean-button')) {
        this.resetForm()
      }

      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      const input = this.shadow.querySelector(`[name="${key}"]`)
      if (input) input.value = value
    })
  }

  showValidationErrors (errors) {
    const errorsContainer = this.shadow.querySelector('.validation-errors')
    const errorsList = this.shadow.querySelector('.validation-errors ul')
    errorsList.innerHTML = ''

    errors.forEach(error => {
      const errorMessage = document.createElement('li')
      errorMessage.textContent = error.message
      errorsList.appendChild(errorMessage)
    })

    errorsContainer.classList.add('active')
  }

  closeValidationErrors () {
    this.shadow.querySelector('.validation-errors').classList.remove('active')
  }

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null
    this.closeValidationErrors()
  }
}

customElements.define('bots-form-component', BotForm)

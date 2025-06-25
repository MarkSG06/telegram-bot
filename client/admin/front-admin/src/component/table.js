class Table extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.loadData()
    this.render()
    this.renderButtons()

    document.addEventListener('confirm-delete', this.handleDeleteConfirmed.bind(this))
  }

  async loadData () {
    try {
      const response = await fetch('/api/admin/users')

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
      console.log(this.data.meta)
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = null
    }
  }

  render () {
    if (!this.data || !this.data.meta || !this.data.rows) {
      this.shadow.innerHTML = '<p>Error al cargar los datos.</p>'
      return
    }

    this.shadow.innerHTML = /* html */`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .tableHeader{
          background-color: hsl(0, 0%, 100%);
          padding: 1rem;
        }
        .sectionTable {
          margin-top: 1rem;
          justify-self: center;
          width: 90%;
          height: auto;
          align-content: center;
          padding: 0.6rem 0 0 0.5rem;
        }
        .tableFilterSVG svg {
          cursor: pointer;
          width: 30px;
          height: 30px;
          color: hsl(0, 0%, 100%);
        }
        .buttonSVGs {
          padding-right: 0.5rem;
          width: 100%;
          height: 3rem;
          align-content: center;
          justify-self: center;
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          align-items: center;
          background-color: hsl(0, 0%, 100%);
        }
        .buttonSVGs svg {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        .saveForm {
          width: 80%;
          justify-self: center;
          background-color: hsl(0, 0%, 0%);
          margin-bottom: 1rem;
        }
        .saveForm ul {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
        }
        .saveForm li {
          color: hsl(0, 0%, 100%);
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }
        .tableNotification {
          bottom: 0;
          margin-bottom: 2rem;
          padding-left: 1rem;
          height: 3rem;
          width: 100%;
          align-content: center;
          justify-self: center;
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          background-color: hsl(0, 0%, 100%);
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }
        .tableMainContainer {
          min-height: 70vh;
          max-height: 70vh;
          overflow-y: scroll;
        }
        .tableMainContainer::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .tableMainContainer::-webkit-scrollbar-thumb {
          background: hsl(271, 76%, 53%);
          border-radius: 4px;
        }
      </style>

      <div class="sectionTable">
        <div class="tableHeader">
          <div class="tableFilterSVG">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920">
              <path d="m0 .011 741.97 984.808v673.566l502.665 251.332V984.82l675.332-896.544-88.154-66.308-697.508 925.891v783.345L852.301 1590.2V947.858L221.322 110.341h1262.289V.011z" fill-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="tableMainContainer"></div>

        <div class="tableNotification">
          <p>${this.data.meta.total} registro(s) en total, mostrando ${this.data.meta.size} por página</p>
        </div>
      </div>
    `

    const container = this.shadow.querySelector('.tableMainContainer')

    this.data.rows.forEach(element => {
      const elementDiv = document.createElement('div')
      elementDiv.classList.add('saveForm')

      const buttonSVGsDiv = document.createElement('div')
      buttonSVGsDiv.classList.add('buttonSVGs')

      const editIconDiv = document.createElement('div')
      editIconDiv.classList.add('edit-button')
      editIconDiv.dataset.id = element.id
      editIconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
          <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

      const deleteIconDiv = document.createElement('div')
      deleteIconDiv.classList.add('delete-button')
      deleteIconDiv.dataset.id = element.id
      deleteIconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 1024 1024">
          <path fill="#000000" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"/>
        </svg>`

      buttonSVGsDiv.appendChild(editIconDiv)
      buttonSVGsDiv.appendChild(deleteIconDiv)

      const elementInfoList = document.createElement('ul')
      const elementInfo = [
        { label: 'Nombre:', value: element.name },
        { label: 'Email:', value: element.email },
        { label: 'Creado el:', value: element.createdAt },
        { label: 'Actualizado el:', value: element.updatedAt },
      ]

      elementInfo.forEach(info => {
        const li = document.createElement('li')
        li.innerHTML = `<strong>${info.label}</strong> ${info.value}`
        elementInfoList.appendChild(li)
      })

      elementDiv.appendChild(buttonSVGsDiv)
      elementDiv.appendChild(elementInfoList)
      container.appendChild(elementDiv)
    })
  }

  renderButtons () {
    const container = this.shadow.querySelector('.tableMainContainer')
    container.addEventListener('click', event => {
      const editBtn = event.target.closest('.edit-button')
      const deleteBtn = event.target.closest('.delete-button')

      if (editBtn) {
        const userId = editBtn.dataset.id
        console.log('Editar usuario con ID:', userId)
      }

      if (deleteBtn) {
        const userId = deleteBtn.dataset.id
        this.selectedUserId = userId

        document.dispatchEvent(new CustomEvent('show-delete-modal', {
          detail: { userId: this.selectedUserId }
        }))
      }
    })
  }

  async handleDeleteConfirmed () {
    if (!this.selectedUserId) return

    try {
      const response = await fetch(`/api/admin/users/${this.selectedUserId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar usuario')
      }

      console.log('Usuario eliminado:', this.selectedUserId)
      await this.loadData()
      this.render()
      this.renderButtons()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}

customElements.define('table-component', Table)

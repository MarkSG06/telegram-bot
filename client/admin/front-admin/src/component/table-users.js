class TableUsers extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.selectedUserId = null
  }

  async connectedCallback () {
    await this.loadData()
    this.render()

    document.addEventListener('confirm-delete', this.handleDeleteConfirmed.bind(this))
  }

  async loadData () {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`)
      }
      this.data = await response.json()
    } catch (error) {
      console.error('Error cargando los datos:', error)
      this.data = { rows: [], meta: { total: 0, size: 0 } }
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        :host {
          max-width: 100%;
          width: 100%;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Noto Sans", sans-serif;
        }
        .table-users {
          width: 90%;
          border: 1px solid rgb(138, 138, 138);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 20px auto;
          background-color: #fff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        thead {
          background-color: #f5f5f5;
        }
        th, td {
          padding: 12px 15px;
          border-bottom: 1px solid #ddd;
        }
        th {
          font-weight: bold;
        }
        tr:hover {
          background-color: #f0f0f0;
        }
        .edit-button, .delete-button {
          cursor: pointer;
          color: #007bff;
          text-align: center;
        }
      </style>

      <section class="table-users">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody id="table-body"></tbody>
        </table>
        <p style="padding: 1rem 0 0 0.5rem;">
          ${this.data.meta.total || 0} registro(s), mostrando ${this.data.meta.size || 0} por página.
        </p>
      </section>
    `

    const tbody = this.shadow.querySelector('#table-body')

    if (this.data.rows && this.data.rows.length > 0) {
      this.data.rows.forEach(user => {
        const row = document.createElement('tr')
        row.setAttribute('data-user-id', user.id)
        row.innerHTML = `
          <td>ID: ${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.createdAt}</td>
          <td>${user.updatedAt}</td>
          <td class="edit-button">✏️</td>
          <td class="delete-button">❌</td>
        `
        tbody.appendChild(row)
      })
    } else {
      const row = document.createElement('tr')
      row.innerHTML = '<td colspan="7">No hay datos disponibles</td>'
      tbody.appendChild(row)
    }

    this.renderButtons()
  }

  renderButtons () {
    const tbody = this.shadow.querySelector('#table-body')

    tbody.addEventListener('click', event => {
      const editBtn = event.target.closest('.edit-button')
      const deleteBtn = event.target.closest('.delete-button')

      if (editBtn) {
        const row = editBtn.closest('tr')
        const userId = row.dataset.userId
        console.log('Editar usuario con ID:', userId)
      }

      if (deleteBtn) {
        const row = deleteBtn.closest('tr')
        this.selectedUserId = row.dataset.userId

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
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}

customElements.define('table-users-component', TableUsers)

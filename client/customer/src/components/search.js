class Search extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
    this.addEventListeners()
  }

  async buscarProductos (query) {
    const res = await fetch(`/api/customer/products/search?query=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Error en la búsqueda')
    return await res.json()
  }

  addEventListeners () {
    const searchInput = this.shadow.querySelector('.search input')
    const searchResults = this.shadow.querySelector('.searchs')
    const ul = this.shadow.querySelector('.searchs ul')
    const overlay = document.createElement('div')
    overlay.classList.add('search-overlay')
    document.body.appendChild(overlay)

    let typingTimeout = null

    const openSearch = () => {
      overlay.classList.add('active')
    }

    const closeSearch = () => {
      document.body.style.overflow = ''
      overlay.classList.remove('active')
      searchResults.classList.add('fadeOut')
      searchResults.classList.remove('fadeIn')
      setTimeout(() => {
        searchResults.classList.remove('active')
        ul.innerHTML = ''
      }, 200)
    }

    searchInput.addEventListener('input', () => {
      clearTimeout(typingTimeout)
      const query = searchInput.value.trim()

      if (query.length === 0) {
        closeSearch()
        return
      }

      typingTimeout = setTimeout(async () => {
        try {
          const resultados = await this.buscarProductos(query)
          ul.innerHTML = ''

          if (resultados.length > 0) {
            resultados.forEach(prod => {
              const li = document.createElement('li')
              li.innerHTML = `
                <a href="${prod.url || '#'}" target="_blank" class="result-link">
                  ${prod.name || prod.nombre || 'Producto sin nombre'}
                </a>
              `
              ul.appendChild(li)
            })
            searchResults.classList.add('active', 'fadeIn')
            searchResults.classList.remove('fadeOut')
            openSearch()
          } else {
            closeSearch()
          }
        } catch (error) {
          console.error('❌ Error al buscar productos:', error)
        }
      }, 1000)
    })

    document.addEventListener('click', (event) => {
      const path = event.composedPath()
      if (!path.includes(this)) closeSearch()
    })

    overlay.addEventListener('click', () => closeSearch())
  }

  async render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .search {
          position: fixed;
          z-index: 9999;
          left: 50%;
          margin-top: 1rem;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: white;
          width: 50%;
          padding: 0.8rem 1rem;
          border-radius: 2rem;
          border: 0;
          color: #6D7075;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .writeInput {
          display: flex;
          gap: 1rem;
        }

        .search input {
          border: 0;
          width: 100%;
          font-size: 1rem;
          outline: none;
        }

        .searchs {
          display: none;
          max-height: 12rem;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #008cff transparent;
        }

        .searchs.active {
          display: block;
        }

        .searchs ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }

        .searchs li {
          color: black;
          cursor: pointer;
          padding: 1rem 2rem;
          border-left: 4px solid #fff;
          transition: all 0.2s ease;
        }

        .searchs li:hover {
          background-color: #59aff627;
          border-radius: 0 2rem 2rem 0;
          border-left: 4px solid #008cff;
        }

        .result-link {
          color: black;
          text-decoration: none;
          display: block;
          width: 100%;
        }

        .result-link:hover {
          color: #008cff;
        }

        /* ✨ Animaciones */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .fadeIn { animation: fadeIn 0.2s ease forwards; }
        .fadeOut { animation: fadeOut 0.2s ease forwards; }

      </style>

      <section class="search">
        <div class="writeInput">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"/>
          </svg>
          <input type="text" name="search" placeholder="Escribe el producto que deseas buscar">
        </div>
        <div class="searchs">
          <ul></ul>
        </div>
      </section>
    `
  }
}

customElements.define('search-product-component', Search)

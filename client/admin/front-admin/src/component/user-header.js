class UserHeader extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.data = [];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    

    this.shadow.innerHTML = /*html*/`
      <style>

        :host{
          max-width: 100%;
          width: 100%;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Noto Sans", sans-serif;
        }
        .users {
          padding: 2rem;
        }
        .header-user {
          display: flex;
          justify-items: stretch;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .create-user button{
          border: 1px solid #0D6EFD;
          background-color: white;
          cursor: pointer;
          font-weight: 700;
          font-size: 20px;
          color: #0D6EFD;
          border-radius: 5px;
          padding: 1rem 2rem;
          text-transform: uppercase;
        }
        .create-user button:hover{
          background-color: #0D6EFD;
          color: white;
        }
        .search-user input{
          border: 2px solid #E6E9EC;
          background-color: white;
          cursor: pointer;
          font-weight: 700;
          font-size: 20px;
          color: #E6E9EC;
          border-radius: 5px;
          padding: 1rem 2rem;
          text-transform: uppercase;
        }
      </style>
      <section class="users">
          <div class="header-user">
              <div class="create-user">
                  <button class="create">+ Crear Usuario</button>
                  <button class="edit">* Editar Usuario</button>
              </div>
              <div class="search-user">
                  <input class="search" type="text" placeholder="Buscar Usuario">
              </div>
          </div>
      </section>
    `
  }
}

customElements.define("user-header-component", UserHeader);

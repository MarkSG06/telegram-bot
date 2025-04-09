class Form extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback() {
    await this.loadData()
    await this.render()
  }

  loadData() {
    this.data = {
      form: {
        windowTitle: 'General',
        icons: {
          clear: `
            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800px\" height=\"800px\" viewBox=\"0 0 24 24\">
              <path fill=\"none\" stroke=\"#000000\" stroke-width=\"2\"
                d=\"M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005\" />
            </svg>
          `,
          save: `
            <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"
              xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\" width=\"800px\" height=\"800px\" viewBox=\"0 0 32 32\"
              version=\"1.1\">
              <title>save-floppy</title>
              <desc>Created with Sketch Beta.</desc>
              <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">
                <g id=\"Icon-Set\" sketch:type=\"MSLayerGroup\" transform=\"translate(-152.000000, -515.000000)\"
                  fill=\"#000000\">
                  <path
                    d=\"M171,525 C171.552,525 172,524.553 172,524 L172,520 C172,519.447 171.552,519 171,519 C170.448,519 170,519.447 170,520 L170,524 C170,524.553 170.448,525 171,525 L171,525 Z M182,543 C182,544.104 181.104,545 180,545 L156,545 C154.896,545 154,544.104 154,543 L154,519 C154,517.896 154.896,517 156,517 L158,517 L158,527 C158,528.104 158.896,529 160,529 L176,529 C177.104,529 178,528.104 178,527 L178,517 L180,517 C181.104,517 182,517.896 182,519 L182,543 Z M160,517 L176,517 L176,526 C176,526.553 175.552,527 175,527 L161,527 C160.448,527 160,526.553 160,526 L160,517 Z M180,515 L156,515 C153.791,515 152,516.791 152,519 L152,543 C152,545.209 153.791,547 156,547 L180,547 C182.209,547 184,545.209 184,543 L184,519 C184,516.791 182.209,515 180,515 Z\"
                    id=\"save-floppy\" sketch:type=\"MSShapeGroup\">
                  </path>
                </g>
              </g>
            </svg>
          `
        },
        nombre: {
          label: 'Nombre',
          type: 'text',
          id: 'nombre',
          name: 'nombre'
        },
        email: {
          label: 'Email',
          type: 'email',
          id: 'email',
          name: 'email'
        }
      }
    }    
  }
  

render() {
  this.shadow.innerHTML = /*html*/`
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
        .windows span{
          background-color: hsl(271, 76%, 53%);
          padding: 0.95rem;
          height: auto;
          color: hsl(0, 0%, 100%);
          font-weight: 600;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }
        /* SECTION MAIN */
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
          <div class="windows">
            <span>${this.data.form.windowTitle}</span>
          </div>
          <div class="toolbarSVGs">
            <div class="clear">
              ${this.data.form.icons.clear}
            </div>
            <div class="save">
              ${this.data.form.icons.save}
            </div>
          </div>
        </div>
      </div>
      <div class="sectionMain">
        <form>
          <div class="fieldGroup">
            <label for="${this.data.form.nombre.id}">${this.data.form.nombre.label}</label>
            <input type="${this.data.form.nombre.type}" id="${this.data.form.nombre.id}" name="${this.data.form.nombre.name}">
          </div>
          <div class="fieldGroup">
            <label for="${this.data.form.email.id}">${this.data.form.email.label}</label>
            <input type="${this.data.form.email.type}" id="${this.data.form.email.id}" name="${this.data.form.email.name}">
          </div>
        </form>
      </div>
    `
}
}

customElements.define('form-component', Form)

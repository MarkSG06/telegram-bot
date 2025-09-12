class BotChat extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = null
    this.threadId = ''
  }

  async connectedCallback () {
    await this.loadData()
    this.render()
  }

  async loadData () {
    try {
      const response = await fetch('/api/customer/chats')

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
      console.log('Datos cargados:', this.data)

      if (this.data.threadId) {
        this.threadId = this.data.threadId
      }
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = null
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Nunito Sans', serif;
      }

      .btnChatBot {
        z-index: 1000;
        position: fixed;
        right: 0;
        bottom: 0;
        cursor: pointer;
      }

      .btnChatBot svg {
        width: 60px;
        background-color: rgb(4, 72, 199);
        fill: white;
        padding: 0.5rem;
        border-radius: 2rem;
        margin: 0 2rem 1.5rem 0;
        transition: all 0.1s ease-in;
      }

      .btnChatBot svg:hover {
        background-color: rgb(0, 153, 255);
        transform: scale(1.2);
      }

      .sectionChatBot {
        z-index: 1000;
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 0 4rem 6rem 0;
        height: 700px;
        width: 450px;
        background: #fff;
        border-radius: 1rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        display: none; /* oculto por defecto */
        flex-direction: column;
        overflow: hidden;
      }

      .sectionChatBot.active {
        display: flex; /* se muestra cuando está activo */
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0472c7;
        color: white;
        padding: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        position: relative;
      }

      .btnClose {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: auto;
        height: 40px;
        cursor: pointer;
        fill: #fff;
      }

      .btnClose:hover {
        fill: red;
      }

      .chat {
        padding: 1rem 0;
        flex: 1;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow-y: auto;
      }

      .chat::-webkit-scrollbar {
        display: none;
      }

      .userArea {
        width: 70%;
        background-color: #cfe2ff;
        padding: 0.8rem;
        text-align: right;
        align-self: flex-end;
        border-radius: 1rem 0 0 1rem;
      }

      .botArea {
        width: 70%;
        background-color: #dbdbdb;
        padding: 0.8rem;
        align-self: flex-start;
        border-radius: 0 1rem 1rem 0;
      }

      .chat span {
        font-weight: bold;
        font-size: 1rem;
        display: block;
        margin-bottom: 2px;
      }

      .chat p {
        font-size: 0.9rem;
      }

      .writeInput {
        display: flex;
        align-items: center;
        border-top: 1px solid #dbdbdb;
        padding: 0.5rem;
        background: #fff;
        gap: 0.5rem;
      }
      .writeInput form {
        width: 100%;
        display: flex;
        gap: 1rem;
      }

      .writeInput textarea {
        width: 90%;
        resize: none;
        border: none;
        font-size: 0.9rem;
        outline: none;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: #f1f1f1;
        min-height: 40px;
        max-height: 80px;
        overflow-y: auto;
      }

      .writeInput button {
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
      }

      .writeInput svg {
        width: 32px;
        height: 32px;
        fill: white;
        background: #0472c7;
        padding: 6px;
        border-radius: 50%;
        transition: 0.2s;
      }

      .writeInput svg:hover {
        background: #0099ff;
        transform: scale(1.1);
      }
    </style>

    <section class="chatbot">
      <div class="btnChatBot">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
        </svg>
      </div>

      <div class="sectionChatBot">
        <div class="header">
          <span>Asistente - Telegram Bot</span>
          <svg class="btnClose" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </div>

        <div class="chat"></div>

        <div class="writeInput">
          <form>
            <textarea name="prompt" placeholder="Escriba aquí..."></textarea>
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
    `
    const chatBox = this.shadow.querySelector('.chat')

    if (this.data && this.data.answer && this.data.answer.text) {
      const botContainer = document.createElement('div')
      botContainer.classList.add('botArea')
      botContainer.innerHTML = `<span>Bot</span><p>${this.data.answer.text}</p>`
      chatBox.appendChild(botContainer)
    }

    const form = this.shadow.querySelector('form')
    const input = this.shadow.querySelector('textarea[name="prompt"]')

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const prompt = input.value.trim()
      if (!prompt) return

      const userContainer = document.createElement('div')
      userContainer.classList.add('userArea')
      userContainer.innerHTML = `<span>Tú</span><p>${prompt}</p>`
      chatBox.appendChild(userContainer)

      chatBox.scrollTop = chatBox.scrollHeight
      input.value = ''

      try {
        const response = await fetch('/api/customer/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            threadId: this.threadId || null
          })
        })

        if (!response.ok) {
          throw new Error('Error en el servidor')
        }

        const result = await response.json()
        console.log('Respuesta:', result)

        if (result.threadId) {
          this.threadId = result.threadId
        }

        if (result.answer && result.answer.text) {
          const botContainer = document.createElement('div')
          botContainer.classList.add('botArea')
          botContainer.innerHTML = `<span>Bot</span><p>${result.answer.text}</p>`
          chatBox.appendChild(botContainer)

          chatBox.scrollTop = chatBox.scrollHeight
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error)
      }
    })

    const btnChatBot = this.shadow.querySelector('.btnChatBot')
    const sectionChatBot = this.shadow.querySelector('.sectionChatBot')

    btnChatBot.addEventListener('click', () => {
      sectionChatBot.classList.toggle('active')
    })
  }
}

customElements.define('bot-chat-component', BotChat)

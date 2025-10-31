import OpenAI from 'openai'
import { ChromaClient } from 'chromadb'

export default class OpenAIService {
  constructor () {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })

    this.assistantId = process.env.OPENAI_ASSISTANT_ID

    if (!this.assistantId) {
      console.error('❌ Falta OPENAI_ASSISTANT_ID en .env')
      throw new Error('Falta la variable OPENAI_ASSISTANT_ID')
    }

    // NO inicializar ChromaDB aquí para evitar problemas
    this.chromaClient = null
  }

  /**
   * Obtiene o crea el cliente de ChromaDB (lazy initialization)
   */
  async getChromaClient () {
    if (!this.chromaClient) {
      this.chromaClient = new ChromaClient()
    }
    return this.chromaClient
  }

  /**
   * Busca productos en ChromaDB usando búsqueda semántica
   */
  async buscarProducto (query) {
    try {
      const client = await this.getChromaClient()
      const collection = await client.getOrCreateCollection({ name: 'products' })

      const results = await collection.query({
        queryTexts: [query],
        nResults: 5
      })
      const ids = results.ids[0] || []
      const metadatas = results.metadatas[0] || []
      const distances = results.distances[0] || []

      if (ids.length === 0) {
        console.log('⚠️ No se encontraron productos en ChromaDB')
        return []
      }

      const productos = ids.map((id, i) => ({
        id,
        distancia: distances[i],
        ...metadatas[i]
      }))

      return productos
    } catch (error) {
      console.error('❌ Error buscando en ChromaDB:', error)
      return []
    }
  }

  /**
   * Ejecuta el asistente de OpenAI con soporte para tools
   */
  async runAssistant (prompt, threadId = null) {
    let currentThreadId = threadId

    try {
      // 1️⃣ Crear hilo si no existe
      if (!currentThreadId) {
        const thread = await this.openai.beta.threads.create()
        currentThreadId = thread.id
      }

      // 2️⃣ Añadir mensaje del usuario
      await this.openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: [{ type: 'text', text: prompt }]
      })

      // 3️⃣ Crear el run del asistente
      let run = await this.openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: this.assistantId
      })

      // 4️⃣ Polling manual del estado del run
      let maxAttempts = 60 // 60 segundos máximo

      while (maxAttempts-- > 0) {
        // Obtener el estado actual del run usando list
        const listResponse = await this.openai.beta.threads.runs.list(currentThreadId)
        const found = listResponse.data?.find(r => r.id === run.id)

        if (!found) {
          console.error('❌ Run no encontrado en list()')
          break
        }

        run = found
        console.log('⏳ Estado actual:', run.status)

        // --- Si requiere acción (tools) ---
        if (run.status === 'requires_action') {
          const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls || []

          // Preparar todos los outputs
          const toolOutputs = []

          for (const toolCall of toolCalls) {
            const funcName = toolCall.function.name
            const args = JSON.parse(toolCall.function.arguments || '{}')

            let output = '[]'
            try {
              // Buscar en ChromaDB usando el método de la clase
              if (funcName === 'buscarProducto' || funcName === 'search_product') {
                const query = args.query || args.userQuestion || ''

                const productos = await this.buscarProducto(query)
                output = JSON.stringify(productos)
              } else {
                output = JSON.stringify([])
              }
            } catch (toolErr) {
              output = JSON.stringify({ error: toolErr.message })
            }

            toolOutputs.push({
              tool_call_id: toolCall.id,
              output
            })
          }

          // ✅ Enviar tool outputs con la sintaxis correcta
          try {
            await this.openai.beta.threads.runs.submitToolOutputs(
              run.id,
              {
                thread_id: currentThreadId,
                tool_outputs: toolOutputs
              }
            )

            // Esperar un poco antes de verificar el nuevo estado
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          } catch (submitErr) {
            console.error('❌ Error enviando tool_outputs:', submitErr)
            break
          }
        }

        // Salir si ya completó o falló
        if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
          break
        }

        // Esperar antes del siguiente chequeo
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Verificar si se agotó el tiempo
      if (maxAttempts <= 0) {
        console.warn('⚠️ Se agotó el tiempo de espera para el run')
      }

      // 5️⃣ Obtener última respuesta del asistente
      const messages = await this.openai.beta.threads.messages.list(currentThreadId)
      const lastMessage = messages.data.find(m => m.role === 'assistant')

      let answerText = 'No se obtuvo respuesta del asistente.'
      if (lastMessage?.content?.[0]?.type === 'text') {
        const text = lastMessage.content[0].text
        answerText = (text?.value ?? text ?? '').toString().trim() || answerText
      }

      return { threadId: currentThreadId, answer: answerText }
    } catch (err) {
      console.error('❌ Error en runAssistant:', err)
      return { threadId: currentThreadId || null, answer: 'Error interno en el asistente.' }
    }
  }
}

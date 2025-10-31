const OpenAIService = require('../../services/openai-service.js').default
const ai = new OpenAIService()

const assistantResponse = async (req, res) => {
  try {
    let { prompt, threadId } = req.body
    if (!prompt && req.file) prompt = '📎 Archivo adjunto recibido.'

    const result = await ai.runAssistant(prompt, threadId)
    let { answer } = result

    if (typeof answer === 'string') {
      try {
        const clean = answer
          .replace(/^[^{]*/, '')
          .replace(/«|»/g, '"')
          .replace(/\\"/g, '"')
          .trim()
        answer = JSON.parse(clean)
      } catch {
        console.warn('⚠️ No se pudo parsear, enviando texto plano.')
        answer = { text: answer }
      }
    }

    res.json({
      threadId: result.threadId,
      answer,
      escalateToHuman: false
    })
  } catch (error) {
    console.error('❌ Error en assistantResponse:', error)
    res.status(500).json({ error: 'Error al obtener respuesta del asistente.' })
  }
}

const relayUserMessage = async (req, res) => {
  res.json({ ok: true, echo: req.body })
}

const getChat = async (req, res) => {
  const { threadId } = req.params
  res.json({ threadId, messages: [] })
}

// ⬇️ Exportación compatible con require()
module.exports = {
  assistantResponse,
  relayUserMessage,
  getChat
}

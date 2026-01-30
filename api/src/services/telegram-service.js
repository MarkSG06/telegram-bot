const TelegramBot = require('node-telegram-bot-api')
const sequelizeDb = require('../models/sequelize')
const BotVerification = sequelizeDb.BotVerification
const { Op } = sequelizeDb.Sequelize

module.exports = class TelegramService
{
  constructor ()
  {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) throw new Error('Falta TELEGRAM_BOT_TOKEN')

    this.bot = new TelegramBot(token, { polling: true })
    this.bot.on('message', (msg) => this.handleMessage(msg))
  }

  async handleMessage (msg)
  {
    if (!msg.text) return

    const chatId = msg.chat.id
    const text = msg.text.trim()

    try {
      const verified = await BotVerification.findOne({
        where: { telegramUserId: chatId }
      })

      if (verified) {
        await this.sendMessage(chatId, `Te he leído: "${text}"`)
        return
      }

      if (!text.startsWith('/login')) {
        await this.sendMessage(
          chatId,
          'Para poder usar este bot, debes iniciar sesión.\n' +
          'Escribe el comando:\n' +
          '/login email:código'
        )
        return
      }

      const match = text.match(/^\/login\s+(.+?):(.+)$/)

      if (!match) {
        await this.sendMessage(
          chatId,
          'Formato incorrecto.\nUsa:\n/login email:código'
        )
        return
      }

      const email = match[1].trim()
      const code = match[2].trim()

      const verification = await BotVerification.findOne({
        where: {
          email,
          verificationCode: code,
          telegramUserId: { [Op.is]: null }
        }
      })

      if (!verification) {
        await this.sendMessage(
          chatId,
          'Código de verificación o correo incorrecto. Inténtalo de nuevo.'
        )
        return
      }

      verification.telegramUserId = chatId
      verification.verificationCode = null
      await verification.save()

      const name = email.split('@')[0]

      await this.sendMessage(
        chatId,
        `¡Hola ${name}! Tu cuenta ha sido verificada correctamente. Ahora puedes hablar conmigo.`
      )

    } catch (err) {
      console.error('❌ Error en bot:', err)
      await this.sendMessage(chatId, 'Error interno del bot')
    }

  }

  async sendMessage (chatId, message)
  {
    try {
      await this.bot.sendMessage(chatId, message)
    } catch (err) {
      console.error('❌ Error enviando mensaje:', err)
    }
  }
}

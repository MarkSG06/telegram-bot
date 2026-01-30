const AuthorizationService = require('../services/authorization-service')
const EmailService = require('../services/email-service')
const { BotVerification } = require('../models/sequelize')

exports.handleEvent = async (redisClient, subscriberClient) =>
{
  await subscriberClient.subscribe('new-customer', async (message) =>
  {
    try {
      const data = JSON.parse(message)

      if (!data || !data.id || !data.email) {
        console.error('❌ Datos inválidos:', data)
        return
      }

      const name = data.name || data.email.split('@')[0]

      const authorizationService = new AuthorizationService()

      // Note: If data.id refers to BotVerification, this token might be invalid for Customer activation
      // but we generate it to satisfy the template requirement.
      const activationUrl =
        await authorizationService.createActivationToken(data.id, 'customer')

      const verificationCode = data.verificationCode || authorizationService.createVerificationCode()

      // If it is a direct bot verification (no name provided), save code to DB
      if (!data.name) {
        await BotVerification.update(
          { verificationCode: String(verificationCode) },
          { where: { id: data.id } }
        )
      }

      await redisClient.set(
        `verification-code:customer:${data.id}`,
        verificationCode
      )

      const emailService = new EmailService('gmail')

      await emailService.sendEmail(
        data,
        'customer',
        'activationUrl',
        {
          name,
          activationUrl,
          verificationCode
        }
      )

    } catch (error) {
      console.error('❌ Error en new-customer:', error)
    }
  })
}

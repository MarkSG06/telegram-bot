const sequelizeDb = require('../../models/sequelize')
const Customer = sequelizeDb.Customer
const BotVerification = sequelizeDb.BotVerification

exports.create = async (req, res, next) =>
{
  try {
    const { email, name, botId } = req.body

    if (!email || !name || !botId) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const customer = await Customer.create({
      email,
      name
    })

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const botVerification = await BotVerification.create({
      email,
      botId,
      verificationCode
    })

    req.redisClient.publish(
      'new-customer',
      JSON.stringify({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        verificationCode // 🔥 Enviamos el mismo código
      })
    )


    res.status(201).json({
      ok: true
    })

  } catch (err) {
    console.error(err)
    next(err)
  }
}

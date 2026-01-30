const sequelizeDb = require('../../models/sequelize')
const BotVerification = sequelizeDb.BotVerification
const Op = sequelizeDb.Sequelize.Op
exports.create = async (req, res, next) =>
{
  try {
    const data = await BotVerification.create(req.body)

    // evento correcto
    req.redisClient.publish('new-customer', JSON.stringify(data))

    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.findAll = async (req, res, next) =>
{
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        whereStatement[key] = { [Op.substring]: req.query[key] }
      }
    }

    const condition = Object.keys(whereStatement).length > 0
      ? { [Op.and]: [whereStatement] }
      : {}

    const result = await BotVerification.findAndCountAll({
      where: condition,
      attributes: ['id', 'email', 'verificationCode', 'telegramUserId', 'botId', 'createdAt', 'updatedAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) =>
{
  try {
    const id = req.params.id
    const data = await BotVerification.findByPk(id)

    if (!data) {
      const err = new Error(`No se puede encontrar el elemento con la id=${id}.`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) =>
{
  try {
    const id = req.params.id
    const [numberRowsAffected] = await BotVerification.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error(`No se puede actualizar el elemento con la id=${id}.`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Actualizado correctamente.' })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.delete = async (req, res, next) =>
{
  try {
    const id = req.params.id
    const numberRowsAffected = await BotVerification.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error(`No se puede borrar el elemento con la id=${id}.`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Borrado correctamente.' })
  } catch (err) {
    next(err)
  }
}

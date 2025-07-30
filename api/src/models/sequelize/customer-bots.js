module.exports = function (sequelize, DataTypes) {
  const CustomerBot = sequelize.define('CustomerBot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      botId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('createdAt')
            ? this.getDataValue('createdAt').toISOString().split('T')[0]
            : null
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('updatedAt')
            ? this.getDataValue('updatedAt').toISOString().split('T')[0]
            : null
        }
      }
    }, {
      sequelize,
      tableName: 'customer-bots',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' }
          ]
        },
        {
          name: 'customer-bots_customerId',
          using: 'BTREE',
          fields: [
            { name: 'customerId' }
          ]
        },
        {
          name: 'customer-bots_botId',
          using: 'BTREE',
          fields: [
            { name: 'botId' }
          ]
        }
      ]
    }
  )

  CustomerBot.associate = function (models) {
    CustomerBot.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    CustomerBot.belongsTo(models.Bot, { as: 'bot', foreignKey: 'botId' })
    CustomerBot.hasMany(models.CustomerBotChat, { as: 'chat', foreignKey: 'customerBotId' })
  }

  return CustomerBot
}

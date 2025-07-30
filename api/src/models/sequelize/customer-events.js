module.exports = function (sequelize, DataTypes) {
  const CustomerEvent = sequelize.define('CustomerEvent',
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
      eventId: {
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
      tableName: 'customer-events',
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
          name: 'customer-events_customerId',
          using: 'BTREE',
          fields: [
            { name: 'customerId' }
          ]
        },
        {
          name: 'customer-events_eventId',
          using: 'BTREE',
          fields: [
            { name: 'eventId' }
          ]
        }
      ]
    }
  )

  CustomerEvent.associate = function (models) {
    CustomerEvent.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    CustomerEvent.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' })
  }

  return CustomerEvent
}

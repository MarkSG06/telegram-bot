module.exports = function (sequelize, DataTypes) {
  const EventOccurrence = sequelize.define('EventOccurrence',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDateTime: {
        type: DataTypes.DATE,
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
      tableName: 'event-occurrences',
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
          name: 'event-occurrences_eventId',
          using: 'BTREE',
          fields: [
            { name: 'eventId' }
          ]
        }
      ]
    }
  )

  EventOccurrence.associate = function (models) {
    EventOccurrence.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' })
  }

  return EventOccurrence
}

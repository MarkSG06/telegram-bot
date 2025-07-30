module.exports = function (sequelize, DataTypes) {
  const Town = sequelize.define('Town',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
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
      tableName: 'towns',
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
        }
      ]
    }
  )

  Town.associate = function (models) {
    Town.hasMany(models.Customer, { as: 'customers', foreignKey: 'townId' })
    Town.hasMany(models.Event, { as: 'events', foreignKey: 'townId' })
    Town.hasMany(models.Spot, { as: 'spots', foreignKey: 'townId' })
  }

  return Town
}

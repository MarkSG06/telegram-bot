module.exports = function (sequelize, DataTypes) {
  const PromoterSpot = sequelize.define('PromoterSpot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      promoterId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spotId: {
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
      tableName: 'promoter-spots',
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
          name: 'promoter-spots_promoterId',
          using: 'BTREE',
          fields: [
            { name: 'promoterId' }
          ]
        },
        {
          name: 'promoter-spots_spotId',
          using: 'BTREE',
          fields: [
            { name: 'spotId' }
          ]
        }
      ]
    }
  )

  PromoterSpot.associate = function (models) {
    PromoterSpot.belongsTo(models.Promoter, { as: 'promoter', foreignKey: 'promoterId' })
    PromoterSpot.belongsTo(models.Spot, { as: 'spot', foreignKey: 'spotId' })
  }

  return PromoterSpot
}

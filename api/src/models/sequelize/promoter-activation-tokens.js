module.exports = function (sequelize, DataTypes) {
  const PromoterActivationToken = sequelize.define('PromoterActivationTokens',
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
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      used: {
        type: DataTypes.BOOLEAN,
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
      tableName: 'promoter-activation-tokens',
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
          name: 'promoter-activation-tokens_promoterId',
          using: 'BTREE',
          fields: [
            { name: 'promoterId' }
          ]
        }
      ]
    }
  )

  PromoterActivationToken.associate = function (models) {
    PromoterActivationToken.belongsTo(models.Promoter, { as: 'promoter', foreignKey: 'promoterId' })
  }

  return PromoterActivationToken
}

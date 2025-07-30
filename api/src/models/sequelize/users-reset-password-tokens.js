module.exports = function (sequelize, DataTypes) {
  const UserResetPasswordTokens = sequelize.define('UserResetPasswordTokens',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
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
      tableName: 'users-reset-password-tokens',
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
          name: 'users-reset-password-tokens_userId',
          using: 'BTREE',
          fields: [
            { name: 'userId' }
          ]
        }
      ]
    }
  )

  UserResetPasswordTokens.associate = function (models) {
    UserResetPasswordTokens.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
  }

  return UserResetPasswordTokens
}

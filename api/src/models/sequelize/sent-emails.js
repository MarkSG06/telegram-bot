module.exports = function (sequelize, DataTypes) {
  const SentEmail = sequelize.define('SentEmail',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      emailTemplate: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sendAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      readedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      uuid: {
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
      tableName: 'sent-emails',
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
          name: 'sent-emails_userId',
          using: 'BTREE',
          fields: [
            { name: 'userId' }
          ]
        }
      ]
    }
  )

  SentEmail.associate = function (models) {
    SentEmail.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
  }

  return SentEmail
}

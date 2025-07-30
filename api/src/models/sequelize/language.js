module.exports = function (sequelize, DataTypes) {
  const Language = sequelize.define('Languages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Alias".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Alias".'
        }
      }
    },
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE
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
    tableName: 'languages',
    timestamps: true,
    paranoid: true, // para manejar soft deletes con deletedAt
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }]
      }
    ]
  })

  Language.associate = function (models) {
    // Relaciones, si las hubiera
    // Por ejemplo:
    // Language.hasMany(models.Translation, { as: 'translations', foreignKey: 'languageId' })
  }

  return Language
}

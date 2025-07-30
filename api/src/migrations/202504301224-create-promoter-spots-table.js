'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promoter-spots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      promoterId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
    await queryInterface.addIndex('promoter-spots', ['promoterId'], {
      name: 'promoter-spots_promoterId'
    })
    await queryInterface.addIndex('promoter-spots', ['spotId'], {
      name: 'promoter-spots_spotId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('promoter-spots')
  }
}

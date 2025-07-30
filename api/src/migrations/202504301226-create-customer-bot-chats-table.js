'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customer-bot-chats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      customerBotId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      emisor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.STRING,
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
    await queryInterface.addIndex('customer-bot-chats', ['customerBotId'], {
      name: 'customer-bot-chats_customerBotId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer-bot-chats')
  }
}

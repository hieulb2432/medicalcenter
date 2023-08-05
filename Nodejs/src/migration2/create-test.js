'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      result: {
        type: Sequelize.STRING,
      },
      bookingId: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      timeType: {
        type: Sequelize.STRING,
      },
      testImage: {
        type: Sequelize.BLOB('long')
      },
      testStatusId: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.STRING, 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tests');
  },
};

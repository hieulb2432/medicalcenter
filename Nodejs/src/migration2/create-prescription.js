'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescriptions', {
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
      diagnostic: {
        type: Sequelize.STRING,
      },
      drugId: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.TEXT('long'),
      },
      doctorAdvice: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      timeType: {
        type: Sequelize.STRING,
      },
      bookingId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('prescriptions');
  },
};

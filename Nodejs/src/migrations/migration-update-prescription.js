'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('prescriptions', 'order', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('prescriptions', 'bookingId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('prescriptions', 'order');
    await queryInterface.removeColumn('prescriptions', 'bookingId');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('doctor_infor', 'paymentId');
    await queryInterface.removeColumn('doctor_infor', 'addressClinic');
    await queryInterface.removeColumn('doctor_infor', 'nameClinic');
    await queryInterface.removeColumn('doctor_infor', 'note');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('doctor_infor', 'paymentId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('doctor_infor', 'addressClinic', {
        type: Sequelize.STRING,
        allowNull: false,
    });
      await queryInterface.addColumn('doctor_infor', 'nameClinic', {
        type: Sequelize.STRING,
            allowNull: false,
      });
      await queryInterface.addColumn('doctor_infor', 'note', {
        type: Sequelize.STRING,
      })
  }
};

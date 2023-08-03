'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tests', 'prescriptionId');
    await queryInterface.removeColumn('prescriptions', 'note');
    await queryInterface.removeColumn('prescriptions', 'order');
    await queryInterface.removeColumn('doctor_infor', 'count');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tests', 'prescriptionId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('prescriptions', 'note', {
        type: Sequelize.STRING,
    });
    await queryInterface.addColumn('prescriptions', 'order', {
        type: Sequelize.STRING,
        allowNull: true, 
      });
      await queryInterface.addColumn('doctor_infor', 'count', {
        type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
      });
  }
};

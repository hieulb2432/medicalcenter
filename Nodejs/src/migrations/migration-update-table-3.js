'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('doctor_infor', 'provinceId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('doctor_infor', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};

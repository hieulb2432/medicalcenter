// Trong file migration mới tạo
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clinics', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: true, // Hoặc false nếu không cho phép giá trị null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clinics', 'provinceId');
  },
};

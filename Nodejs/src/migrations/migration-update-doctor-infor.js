// Trong file migration mới tạo
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('doctor_infor', 'contentHTML', {
        allowNull: false,
        type: Sequelize.TEXT('long'),
    });
    await queryInterface.addColumn('doctor_infor', 'contentMarkdown', {
        allowNull: false,
        type: Sequelize.TEXT('long'),
    });
    await queryInterface.addColumn('doctor_infor', 'description', {
        allowNull: true,
        type: Sequelize.TEXT('long'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('doctor_infor', 'contentHTML');
    await queryInterface.removeColumn('doctor_infor', 'contentMarkdown');
    await queryInterface.removeColumn('doctor_infor', 'description');
  },
};

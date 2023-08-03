'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tests.belongsTo(models.Booking, { foreignKey: 'bookingId', targetKey: 'id', as: 'bookingData' });
      // Tests.belongsTo(models.Prescription, { foreignKey: 'prescriptionId', targetKey: 'id', as: 'prescriptionData' });
      Tests.belongsTo(models.Allcode, {foreignKey: 'testStatusId', targetKey: 'keyMap', as: 'statusIdTestData'});

    }
  };
  Tests.init({    
    patientId: DataTypes.STRING,
    doctorId: DataTypes.STRING,
    result: DataTypes.STRING,   
    timeType: DataTypes.STRING,
    date: DataTypes.STRING,
    bookingId: DataTypes.INTEGER,
    // prescriptionId: DataTypes.INTEGER,
    order: DataTypes.STRING, 
    testImage: DataTypes.BLOB('long'),
    testStatusId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tests',
  });
  return Tests;
};
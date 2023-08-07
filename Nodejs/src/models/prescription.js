'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prescription.belongsTo(models.Allcode, {foreignKey: 'drugId', targetKey: 'keyMap', as: 'drugTypeData'});
      Prescription.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientPrescriptionData' });
      Prescription.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorPrescriptionData' });
      Prescription.belongsTo(models.Allcode, {foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypePrescription'});
      Prescription.belongsTo(models.Booking, {foreignKey: 'bookingId'})
    }
  };
  Prescription.init({    
    patientId: DataTypes.STRING,
    doctorId: DataTypes.STRING,
    diagnostic: DataTypes.STRING,
    drugId: DataTypes.STRING,
    quantity: DataTypes.TEXT('long'),
    // note: DataTypes.STRING,
    doctorAdvice: DataTypes.STRING,
    timeType: DataTypes.STRING,
    date: DataTypes.STRING,
    bookingId: DataTypes.INTEGER,
    // order: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};
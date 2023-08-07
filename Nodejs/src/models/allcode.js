'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Allcode.hasMany(models.User, {foreignKey: 'positionId', as: 'positionData'});
      Allcode.hasOne(models.User, {foreignKey: 'roleId', as: 'roleData'});
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
      Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' });
      Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' });
      Allcode.hasMany(models.Booking, { foreignKey: 'statusId', as: 'statusIdData' });
      
      Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'priceId', as: 'priceTypeData' });
      Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'provinceId', as: 'provinceTypeData' });
      Allcode.hasMany(models.Clinic, { foreignKey: 'provinceId', as: 'provinceDataClinic' });

      Allcode.hasMany(models.Prescription, { foreignKey: 'timeType', as: 'timeTypePrescription' });
      Allcode.hasMany(models.Prescription, { foreignKey: 'drugId', as: 'drugTypeData' });

      Allcode.hasMany(models.Tests, { foreignKey: 'testStatusId', as: 'statusIdTestData' });
      
    }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};
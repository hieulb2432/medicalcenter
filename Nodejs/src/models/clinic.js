'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.belongsTo(models.Allcode, {foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceDataClinic'});
      Clinic.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId', as: 'clinicData' });
    }
  };
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    provinceId: DataTypes.STRING,
    image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};
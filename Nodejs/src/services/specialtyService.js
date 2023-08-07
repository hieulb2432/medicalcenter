import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

let createSpecialty = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.name || !data.imageBase64 ||
        !data.descriptionHTML || !data.descriptionMarkdown        
        ){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        await db.Specialty.create({
            name: data.name,
            image: data.imageBase64,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown
        })
        resolve({
            errCode: 0,
            errMessage: 'OKKK'
        })
      }
    } catch(e){
      reject(e);
    }
  })
}

let getAllSpecialty = () => {
  return new Promise(async(resolve, reject) => {
    try{
      let data = await db.Specialty.findAll({
        order: [['createdAt', 'DESC']]
      })
      if(data && data.length > 0) {
        data.map((item) =>
            (item.image = Buffer.from(item.image, 'base64').toString('binary'))
        );
      }
      resolve({
        errCode: 0,
        errMessage: 'OK',
        data
      })
    } catch(e) {
      reject(e)
    }
  })
}

let getDetailSpecialtyById = (inputId, clinicId) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!inputId) {
        
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId
          }, 
          attributes: ['descriptionHTML', 'descriptionMarkdown'],
        })
        if(data){
          let doctorSpecialty = []
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: {
              specialtyId: inputId,
              clinicId: clinicId,
            },
            attributes: ['doctorId'],
          }) 
          data.doctorSpecialty = doctorSpecialty
        } else data = {}
        resolve({
          errCode: 0,
          errMessage: 'OK',
          data
        })
      }
    } catch(e) {
      reject(e)
    }
  })
}

let handleDeleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: specialtyId },
        include: [
          {
            model: db.Doctor_Infor,
            as: 'specialtyData',
          }
        ],
        raw : true ,
        nest : true
      });
      if (specialty.specialtyData.id) {
        resolve({
          errCode: 3,
          errMessage: 'Không thể xóa do đang liên kết với bác sĩ',
        });
      }
      if (!specialty.specialtyData.id) {
        await db.Specialty.destroy({
          where: { id: specialtyId },
        });
        resolve({
          errCode: 0,
          message: 'The specialty is deleted!',
        });
      }
      
    } catch (e) {
      reject(e);
    }
  });
};

let handleEditSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.imageBase64 ||
        !data.descriptionHTML || !data.descriptionMarkdown ) {
        resolve({
          errCode: 10,
          errMessage: 'Missing required parameter!',
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (specialty) {
        specialty.name = data.name,
        specialty.descriptionHTML = data.descriptionHTML;
        specialty.descriptionMarkdown = data.descriptionMarkdown;
        if (data.image) {
          specialty.image = data.image
        }
        await specialty.save();
        resolve({
          errCode: 0,
          message: 'Update user data successfully!',
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: 'The user is not exist!',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};  

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleEditSpecialty: handleEditSpecialty
}
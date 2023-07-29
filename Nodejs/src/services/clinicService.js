import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

let createClinic = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.name || !data.imageBase64 || !data.address ||
        !data.descriptionHTML || !data.descriptionMarkdown        
        ){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        await db.Clinic.create({
            name: data.name,
            address: data.address,
            image: data.imageBase64,
            provinceId: data.selectedProvince.value,
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

let getAllClinic = () => {
  return new Promise(async(resolve, reject) => {
    try{
      let data = await db.Clinic.findAll({
        include: [
          {model: db.Allcode, as: 'provinceDataClinic', attributes: ['valueEn', 'valueVi']},
        ], 
        raw: true
      })
      if(data && data.length > 0) {
        data.map((item) =>
            (item.image = Buffer.from(item.image, 'base64').toString('binary'))
        );
      }
      data.reverse()
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

let getDetailClinicById = (inputId) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      } else {
        let data = await db.Clinic.findOne({
            where: {
              id: inputId
            }, 
            attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address']
          })

          if(data){
            let doctorClinic = []
            doctorClinic = await db.Doctor_Infor.findAll({
                where: {clinicId: inputId},
                attributes: ['doctorId']
            })
            data.doctorClinic = doctorClinic
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

let handleDeleteClinic = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: clinicId },
        include: [
          {
            model: db.Doctor_Infor,
            as: 'clinicData',
          }
        ],
        raw : true ,
        nest : true
      });
      if (clinic.clinicData.id) {
        resolve({
          errCode: 3,
          errMessage: 'Không thể xóa do đang liên kết với bác sĩ',
        });
      }
      if (!clinic.clinicData.id) {
        await db.Clinic.destroy({
          where: { id: clinicId },
        });
        resolve({
          errCode: 0,
          message: 'Cơ sở y tế đã bị xóa!',
        });
      }
      
    } catch (e) {
      reject(e);
    }
  });
};

let handleEditClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.imageBase64 || !data.address ||
        !data.descriptionHTML || !data.descriptionMarkdown ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!',
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (clinic) {
        clinic.name = data.name,
        clinic.address = data.address,
        clinic.descriptionHTML = data.descriptionHTML;
        clinic.descriptionMarkdown = data.descriptionMarkdown;
        clinic.provinceId = data.provinceId;
        if (data.imageBase64) {
          clinic.image = data.imageBase64
        }
        await clinic.save();
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

let getFilterClinic = (location) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!location) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      } else {
            let listClinic = []
            if(location === 'ALL'){
              listClinic = await db.Clinic.findAll({
                include: [
                  {
                    model: db.Allcode,
                    as: 'provinceDataClinic',
                    attributes: ['valueEn', 'valueVi'],
                  }
                ],
                raw: true
              }) 
            } else{
              // find user by role
              listClinic = await db.Clinic.findAll({
                where: {
                  provinceId: location
                },
                include: [
                  {
                    model: db.Allcode,
                    as: 'provinceDataClinic',
                    attributes: ['valueEn', 'valueVi'],
                  }
                ],
                raw: true
              }) 
            }
          
          listClinic.reverse();
          if(listClinic && listClinic.length > 0) {
            listClinic.map((item) =>
                (item.image = Buffer.from(item.image, 'base64').toString('binary'))
            );
          }
          resolve({
            errCode: 0,
            errMessage: 'OK',
            listClinic
          })


      }
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    handleDeleteClinic: handleDeleteClinic,
    handleEditClinic: handleEditClinic,
    getFilterClinic: getFilterClinic
}
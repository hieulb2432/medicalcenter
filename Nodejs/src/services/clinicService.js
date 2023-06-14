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
      let data = await db.Clinic.findAll()
      if(data && data.length > 0) {
        data.map((item) =>
            (item.image = Buffer.from(item.image, 'base64').toString('binary'))
        );
        console.log(data)
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

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
}
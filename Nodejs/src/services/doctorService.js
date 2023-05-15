import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'
const { Op } = require("sequelize");

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({ 
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                  },
                include: [
                    {
                      model: db.Allcode,
                      as: 'positionData',
                      attributes: ['valueEn', 'valueVi'],
                    },
                    {
                      model: db.Allcode,
                      as: 'genderData',
                      attributes: ['valueEn', 'valueVi'],
                    },
                  ],
                  raw: true,
                  nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
  return new Promise (async(resole, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {roleId: 'R2'},
        attributes: {
          exclude: ['password', 'image'],
        },
        
      })
      resole({
        errCode: 0,
        data: doctors
      })
    } catch (e) {
        reject(e);
    }
  })
}

let checkRequiredFields = (inputData) => {
  let arr = [
    'doctorId',
    'contentHTML',
    'contentMarkdown',
    'action',
    'selectedPrice',
    'selectedPayment',
    'selectedProvince',
    'nameClinic',
    'addressClinic',
    'note',
    'specialtyId',
  ];
  let isValid = true;
  let element = '';
  for (let i = 0; i <arr.length; i++) {
    if (!inputData[arr[i]]){
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return{
    isValid,
    element
  }
}
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async(resolve, reject) => {
    try{
      let checkObj = checkRequiredFields(inputData);

      if(checkObj.isValid===false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter ${checkObj.element}`
        })
      } else {
        // Update && Insert to Markdown table
        if (inputData.action === 'CREATE') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
          }
        }
        // Update && Insert to Doctor Infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        })

        if(doctorInfor){
          // Update
            doctorInfor.doctorId = inputData.doctorId;
            doctorInfor.priceId = inputData.selectedPrice;
            doctorInfor.provinceId = inputData.selectedProvince;
            doctorInfor.paymentId = inputData.selectedPayment;
            doctorInfor.nameClinic = inputData.nameClinic;
            doctorInfor.addressClinic = inputData.addressClinic;
            doctorInfor.note = inputData.note;
            doctorInfor.specialtyId = inputData.specialtyId;
            doctorInfor.clinicId = inputData.clinicId;
            await doctorInfor.save();
        } else {
          // Create
            await db.Doctor_Infor.create({
              doctorId: inputData.doctorId,
              priceId: inputData.selectedPrice,
              provinceId: inputData.selectedProvince,
              paymentId: inputData.selectedPayment,
              nameClinic: inputData.nameClinic,
              addressClinic: inputData.addressClinic,
              note: inputData.note,
              specialtyId: inputData.specialtyId,
              clinicId: inputData.clinicId
            });
        }
        
        resolve({
          errCode: 0,
          errMessage: 'Save data successfully'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getDetailDoctorById = (inputId) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!inputId){
        resolve({
          errCode: 1,
          errMessage: 'id is null'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          }, 
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId'],
              }, 
              include: [
                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
              ]
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
          // data.image = new Buffer(data.image, 'base64').toString('binary');
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        }

        if(!data) data ={};

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {

    }
  })
}

let bulkCreateSchedule = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.arrSchedule  || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameters'
        })
      } else {
        let schedule = data.arrSchedule
        if(schedule && schedule.length > 0) {
          schedule = schedule.map(item => {
            item.maxNumber = MAX_NUMBER_SCHEDULE
            return item;

          })
        }

        //get all existed schedule
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date,
            // [Op.not]: [
            //   {
            //     createdAt: {
            //       [Op.lt]: (new Date)
            //     }
            //   }
            // ]
          },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true,
        });

        //compare existed schedule vs new schedule
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        // create data
        if(toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }
    
        resolve({
          errCode: 0,
          errMessage: 'Create schedule success!'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!doctorId || !date){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        const quaterHour = 60 * 60 * 250
        let dataBooking = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            statusId: ['S2','S3','S1'],
            [Op.not]: [
              { statusId: 'S1' },
              {
                createdAt: {
                  [Op.lt]: (new Date - quaterHour)
                }
              }
            ]
          },
          attributes:  ['timeType'],
        }) 
        let listTimeBooking = dataBooking.map(function(item) {
          return item['timeType'];
        });
        let dataScheduleAvailable = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            timeType: {
              [Op.notIn]: listTimeBooking,
            }
          },
          include: [
            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
            { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
          ],
          raw: false,
          nest: true,
        })

        let dataScheduleFreeze = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            timeType: listTimeBooking,
          },
          include: [
            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
            { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
          ],
          raw: false,
          nest: true,
        })
        
        // console.log('check', dataSchedule)
      if (!dataScheduleAvailable && !dataScheduleFreeze) {
          dataScheduleAvailable = [];
          dataScheduleFreeze = [];
        }
        resolve({
          errCode: 0,
          dataAvailable: dataScheduleAvailable,
          dataFreeze: dataScheduleFreeze
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!doctorId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId:doctorId,
          },
          attributes: {
            exclude: ['doctorId', 'id']
          },
          include: [
            {
              model: db.Allcode,
              as: 'priceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'provinceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'paymentTypeData',
              attributes: ['valueEn', 'valueVi'],
            }
          ],
          raw: false,
          nest: true,
        })

      if (!data) data = {};
      
      resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch(e){
      reject(e)
    }
  })
}

let getProfileDoctorById = (doctorId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId
          }, 
          attributes: {
            exclude: ['password'],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId'],
              }, 
              include: [
                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
              ]
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
          // data.image = new Buffer(data.image, 'base64').toString('binary');
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        }

        if(!data) data ={};

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch(e) {
      reject(e)
    }
  })
}

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
              ]
            },
            {
              model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            }
          ],
          raw: false,
          nest: true,
        })
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let sendRemedy = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.email || !data.doctorId || !data.patientId 
        || !data.timeType || !data.imgBase64){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        // Update patient status
        let appointment = await db.Booking.findOne({
          where: {
            statusId: 'S2',
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType
          },
          raw: false
        })
        if(appointment){
          appointment.statusId = 'S3';
          await appointment.save();
        }
        await emailService.sendAttachment(data)
        resolve({
          errCode: 0,
          errMessage: 'OK'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
}
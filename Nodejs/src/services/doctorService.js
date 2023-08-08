import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'
const { Op } = require("sequelize");

let getTopDoctorHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({ 
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
  return new Promise (async(resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {roleId: 'R2'},
        attributes: {
          exclude: ['password', 'image'],
        },
        
      })
      resolve({
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
            doctorInfor.specialtyId = inputData.specialtyId;
            doctorInfor.clinicId = inputData.clinicId;
            doctorInfor.contentHTML = inputData.contentHTML;
            doctorInfor.contentMarkdown = inputData.contentMarkdown;
            doctorInfor.description = inputData.description;
            await doctorInfor.save();
        } else {
          // Create
            await db.Doctor_Infor.create({
              contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
              doctorId: inputData.doctorId,
              priceId: inputData.selectedPrice,
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
              ]
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
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
            return item;
          })
        }

        //get all existed schedule
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date,},
          attributes: ['timeType', 'date', 'doctorId'],
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
        const quaterHour = 15 * 60 * 1000
        let dataBooking = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            statusId: ['S2','S3','S1', 'S5'],
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
                // {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
              ]
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
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
            },
            {
              model: db.User, as: 'doctorDataUser',
              attributes: ['lastName', 'firstName']
            },
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

let getListSuccessPatient = (doctorId, date) => {
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
            statusId: 'S3',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender', 'email', 'phoneNumber', 'lastName'],
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

let getListPatientForOneDoctor = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let existing = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          attributes: ['timeType', 'date', 'doctorId'],
          include: [
            {
              model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
            }
          ],
          raw: true,
        });
        resolve({
          errCode: 0,
          data: existing
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getInforUserBooking = (doctorId, date, timeType) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date || !timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let userBookingInfor = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            timeType: timeType
          },
          attributes: ['timeType', 'statusId', 'patientId'],
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName'],
            },
            {
              model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            },
            {
              model: db.Allcode, as: 'statusIdData', attributes: ['valueEn', 'valueVi']
            }, 
          ],
          raw: true,
        });
        resolve({
          errCode: 0,
          data: userBookingInfor
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getScheduleCancel = (doctorId, date, timeType) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date || !timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        // const quaterHour = 15 * 60 * 1000
        let userBookingInfor1 = await db.Booking.findOne({
          where: {
            doctorId: doctorId,
            date: date,
            timeType: timeType,
            statusId: ['S2','S3','S1'],
          },
          order: [['createdAt', 'DESC']],
          raw: false,
        });

        let userBookingInfor2 = await db.Booking.findOne({
          where: {
            doctorId: doctorId,
            date: date,
            timeType: timeType,
            statusId: ['S4'],
          },
          order: [['createdAt', 'DESC']],
          raw: false,
        });

        if(userBookingInfor1.statusId === 'S1' || userBookingInfor1.statusId === 'S2') {
          userBookingInfor1.statusId = 'S5';
          await userBookingInfor1.save();
          let userEmail = await db.User.findOne({
            where: {
              id: userBookingInfor1.patientId
            }, 
            raw: true
          })
          await emailService.sendCancelEmail(userBookingInfor1, userEmail.email)
        } else if (userBookingInfor2.statusId === 'S4') {
          userBookingInfor2.statusId = 'S5';
          await userBookingInfor2.save();
        } 
        resolve({
          errCode: 0,
          data1: userBookingInfor1,
          data2: userBookingInfor2,
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createPrescription = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.diagnostic){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let checkPrescription = await db.Prescription.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.timeType,
          }, 
          raw: false
        })
        if(!checkPrescription) {
          await db.Prescription.create({
              diagnostic: data.diagnostic,
              drugId: data.drugId,
              quantity: data.quantity,
              note: data.note,
              doctorAdvice: data.doctorAdvice,
              doctorId: data.doctorId,
              patientId: data.patientId,
              date: data.date,
              timeType: data.timeType,
              quantity: JSON.stringify(data.dataDrug),
              bookingId: data.bookingId,
          })
        } else {
          checkPrescription.diagnostic = data.diagnostic,
          checkPrescription.drugId = data.drugId,
          checkPrescription. quantity = data.quantity,
          checkPrescription.note = data.note,
          checkPrescription.doctorAdvice = data.doctorAdvice,
          checkPrescription.quantity = JSON.stringify(data.dataDrug)
          checkPrescription.bookingId = data.bookingId
          await checkPrescription.save();
          resolve({
            errCode: 0,
            message: 'Update Prescription data successfully!',
          });
        }
        let checkBooking = await db.Booking.findOne({
          where: {
            id: data.bookingId
          },
          raw: false,
        })
        if (checkBooking) {
          checkBooking.statusId = 'S3'
          await checkBooking.save();
        }
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

let getMedicalRecord = (patientId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!patientId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Prescription.findAll({
          where: {
            patientId: patientId
          }, 
          order: [['date', 'DESC']],
          attributes: {
            exclude: ['drugId', 'note', 'createdDate', 'updatedDate'],
          },
          include: [
            {
              model: db.User,
              as: 'patientPrescriptionData',
              attributes: ['firstName', 'lastName', 'address'],
              include: [
                {
                  model: db.Allcode,
                  as: 'genderData',
                  attributes: ['valueEn', 'valueVi'],
                }
              ]
            },
            {
              model: db.User,
              as: 'doctorPrescriptionData',
              attributes: ['firstName', 'lastName'],
            },
            {
              model: db.Allcode,
              as: 'timeTypePrescription',
              attributes: ['valueEn', 'valueVi'],
            },
           
          ],
          raw: false,
          nest: true,
        })

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

let createTest = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.order){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let checkBooking = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.timeType,
          }, 
          raw: false
        })

        if(checkBooking) {
          let checkTest = await db.Tests.findOne({
            where: {
              doctorId: data.doctorId,
              patientId: data.patientId,
              date: data.date,
              timeType: data.timeType,
            }, 
            raw: false,
          })
          if(!checkTest) {
            await db.Tests.create({
              doctorId: data.doctorId,
              patientId: data.patientId,
              date: data.date,
              timeType: data.timeType,
              order: data.order,
              bookingId: data.bookingId,
              testStatusId: 'T1'
            })
          } 
          else {
            checkTest.doctorId = data.doctorId,
            checkTest.patientId= data.patientId,
            checkTest.date= data.date,
            checkTest.timeType = data.timeType,
            checkTest.order = data.order,
            checkTest.bookingId = data.bookingId,
            checkTest.testStatusId = 'T1'
            await checkTest.save()
            resolve({
              errCode: 0,
              message: 'Update Prescription data successfully!',
            });
          }
          resolve({
            errCode: 0,
            message: 'Update Prescription data successfully!',
          });
        }
        resolve({
            errCode: 0,
            errMessage: 'OKKK',
        })
      }
    } catch(e){
      reject(e);
    }
  })
}

let getTest = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Tests.findAll({
          where: {
            testStatusId: 'T1',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Booking, as: 'bookingData',
              include: [
                {model: db.User, as: 'patientData', attributes: ['firstName', 'lastName', 'address', 'id']},
                {model: db.User, as: 'doctorDataUser', attributes: ['firstName', 'lastName']},
                {
                  model: db.Allcode, as: 'timeTypeDataPatient',
                  attributes: ['valueVi', 'valueEn']
                }
              ]
            },
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

let sendTest = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.result || !data.testImage){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
          let checkTest = await db.Tests.findOne({
            where: {
              doctorId: data.doctorId,
              patientId: data.patientId,
              date: data.date,
              timeType: data.timeType,
            }, 
            raw: false,
          })
          if(checkTest) {
            checkTest.doctorId = data.doctorId,
            checkTest.patientId= data.patientId,
            checkTest.date= data.date,
            checkTest.timeType = data.timeType,
            checkTest.order = data.order,
            checkTest.bookingId = data.bookingId,
            checkTest.result = data.result,
            checkTest.testStatusId = 'T2',
            checkTest.testImage = data.testImage
            await checkTest.save()
            resolve({
              errCode: 0,
              message: 'Update Prescription data successfully!',
            });
          }
          resolve({
            errCode: 0,
            message: 'Update Prescription data successfully!',
          });
        
        resolve({
            errCode: 0,
            errMessage: 'OKKK',
        })
      }
    } catch(e){
      reject(e);
    }
  })
}

let getTestDone = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Tests.findAll({
          where: {
            testStatusId: 'T2',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Booking, as: 'bookingData',
              include: [
                {model: db.User, as: 'patientData', attributes: ['firstName', 'lastName', 'address', 'id']},
                {model: db.User, as: 'doctorDataUser', attributes: ['firstName', 'lastName']},
                {
                  model: db.Allcode, as: 'timeTypeDataPatient',
                  attributes: ['valueVi', 'valueEn']
                }
              ]
            },
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

let getTestResult = (bookingId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!bookingId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let checkData = await db.Tests.findOne({
          where: {
            bookingId: bookingId,
          },
          include: [
            {
              model: db.Booking, as: 'bookingData',
              include: [
                {model: db.User, as: 'patientData', attributes: ['firstName', 'lastName', 'address', 'id']},
                {model: db.User, as: 'doctorDataUser', attributes: ['firstName', 'lastName']},
                {model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueVi', 'valueEn']}
              ]
            },
          ],
          raw: false,
          nest: true,
        })
        resolve({
          errCode: 0,
          data: checkData
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
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    getListSuccessPatient: getListSuccessPatient,
    getListPatientForOneDoctor: getListPatientForOneDoctor,
    getInforUserBooking: getInforUserBooking,
    getScheduleCancel: getScheduleCancel,
    createPrescription: createPrescription,
    getMedicalRecord: getMedicalRecord,
    createTest: createTest,
    getTest: getTest,
    sendTest: sendTest,
    getTestDone: getTestDone,
    getTestResult: getTestResult
}
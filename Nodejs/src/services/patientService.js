import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
  return result
}

let postBookAppointment = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.email || !data.doctorId || !data.timeType || !data.date
        || !data.fullName || !data.selectedGender || !data.address 
        ){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let token = uuidv4()
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          language: data.language,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          redirectLink: buildUrlEmail(data.doctorId, token)
        })

        let user = await db.User.findOne({ where: { email: data.email }, raw: false });

        if (user) {
          // Nếu tìm thấy người dùng, tiến hành cập nhật thông tin
          user.roleId = 'R3';
          user.gender = data.selectedGender;
          user.address = data.address;
          user.firstName = data.fullName;
          user.phoneNumber = data.phoneNumber;
          user.password = '';
          user.lastName = '';
          user.image = '';
          user.positionId = 'P0'
        
          await user.save();
          await db.Booking.create({

            statusId: 'S1',
            doctorId: data.doctorId,
            patientId: user.id,
            date: data.date,
            timeType: data.timeType,
            token: token,
          
        });
        } else {
          // Nếu không tìm thấy người dùng, tạo mới một bản ghi
          const newUser = await db.User.create({
            email: data.email,
            roleId: 'R3',
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber,
            password: '',
            lastName: '',
            image: '',
            positionId: 'P0'
          });
          await db.Booking.create({

            statusId: 'S1',
            doctorId: data.doctorId,
            patientId: newUser.id,
            date: data.date,
            timeType: data.timeType,
            token: token,
        });
        }

          setTimeout(async () => {
            let appointment = await db.Booking.findOne({
              where: {
                doctorId: data.doctorId,
                token: token,
                statusId: 'S1'
              }, 
              raw: false
            })
            appointment.statusId = 'S4';
            await appointment.save()
          }, 15*60*1000)

          resolve({
            errCode: 0,
            errMessage: 'Save infor patient succeed!',
          })
      }
    } catch(e) {
      reject(e)
    }
  })
}

let checkTimeToVerify = (appointment) => {
  let createDate = new Date(appointment.createdAt).getTime()
  const now = +new Date().getTime();
  const diffInMilliseconds = Math.abs(now - createDate);
  // Tính toán khoảng cách tương ứng với 15 phút trong mili giây
  const fifteenMinutesInMilliseconds = 15 * 60 * 1000;

  // So sánh khoảng cách giữa 2 timestamp với khoảng cách tương ứng với 15 phút
  if (diffInMilliseconds >= fifteenMinutesInMilliseconds) {
    return false
  } else if (diffInMilliseconds < fifteenMinutesInMilliseconds) {
    return true
  }
}

let postVerifyBookAppointment = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.token || !data.doctorId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          }, 
          raw: false
        })
        
        if(appointment){
          let checkTime = checkTimeToVerify(appointment)
          if(checkTime) {
            appointment.statusId = 'S2';
            await appointment.save()
            resolve({
              errCode: 0,
              errMessage: 'Update Appoinment succeed!',
            })
          }
        } else {
          let appointment2 = await db.Booking.findOne({
            where: {
              doctorId: data.doctorId,
              token: data.token,
              statusId: 'S4'
            }, 
            raw: false
          })
          if(appointment2) {
            resolve({
              errCode: 4,
              errMessage: 'Quá thời gian',
            })
          } else {
            resolve({
              errCode: 2,
              errMessage: 'Appoinment has been actived or not exist',
            })
          }
        }
      }
    } catch(e){
      reject(e);
    }
  })
}

let getHistoryAppointment = (email) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!email){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let checkUser = await db.User.findOne({
          where: {
            email: email,
          }, 
          raw: false
        })
        
        if(checkUser){
          let fullCode = uuidv4()
          let codeUser = fullCode.substring(0, 5).toUpperCase();
          await emailService.sendTokenEmail({
            email: checkUser.email,
            id: codeUser
          })
          
          checkUser.codeUser = codeUser;
          await checkUser.save()
          
          resolve({
            errCode: 0,
            errMessage: 'Succeed!',
            codeUser: checkUser.codeUser
          })
        }
      }
    } catch(e){
      reject(e);
    }
  })
}

let getAllHistorySchedule = (email, codeUser) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!email || !codeUser){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let checkUser = await db.User.findOne({
          where: {
            email: email,
            codeUser: codeUser
          },
          attributes: {
            exclude: ['password', 'gender', 'image', 'roleId', 'positionId'],
          },
          include: [
            {
              model: db.Allcode,
              as: 'genderData',
              attributes: ['valueEn', 'valueVi'],
            },
            { model: db.Booking,
              as: 'patientData', attributes: ['date', 'timeType', 'updatedAt', 'statusId', 'id'], 
              include: [
                {model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'statusIdData', attributes: ['valueEn', 'valueVi']},
                {model: db.User, as: 'doctorDataUser', attributes: ['lastName', 'firstName'],
                include: [
                      {
                      model: db.Doctor_Infor,
                      include: [
                        {model: db.Clinic, as: 'clinicData', attributes: ['name']},
                        {model: db.Specialty, as: 'specialtyData', attributes: ['name']},
                      ]
                    }
                  ]
                }
              ]
            },
          ],
          raw: false
        })
        if(checkUser){
          resolve({
            errCode: 0,
            errMessage: 'Succeed!',
            data: checkUser
          })
        }
      }
    } catch(e){
      reject(e);
    }
  })
}

let getAllBooking = () => {
  return new Promise(async(resolve, reject) => {
    try{
      let data = await db.Booking.findAll()
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

let getBookingCancelForPatient = (bookingId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!bookingId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        // const quaterHour = 15 * 60 * 1000
        let checkCancel = await db.Booking.findOne({
          where: {
            id: bookingId,
            statusId: ['S2','S1'],
          },
          raw: false,
        });

        if (checkCancel) {
          checkCancel.statusId = 'S4'
          await checkCancel.save()
        }
        resolve({
          errCode: 0,
          data: checkCancel,
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getHistoryAppointment: getHistoryAppointment,
    getAllHistorySchedule: getAllHistorySchedule,
    getAllBooking: getAllBooking,
    getBookingCancelForPatient: getBookingCancelForPatient
}
import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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

        // Update or insert User
        let user = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
              email: data.email,
              roleId: 'R3',
              gender: data.selectedGender,
              address: data.address,
              firstName: data.fullName,
            },
            raw: true
          });

          if (user && user[0]) {
            await db.Booking.create({

                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: user[0].id,
                date: data.date,
                timeType: data.timeType,
                token: token,
              
            });
          }


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
  console.log(diffInMilliseconds)
  console.log(createDate, now, typeof(createDate), typeof(now))
  // Tính toán khoảng cách tương ứng với 15 phút trong mili giây
  const fifteenMinutesInMilliseconds = 1 * 60 * 1000;

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
          console.log(checkTime)
          if(checkTime) {
            appointment.statusId = 'S2';
            await appointment.save()
            resolve({
              errCode: 0,
              errMessage: 'Update Appoinment succeed!',
            })
          } else {
            appointment.statusId = 'S4';
            await appointment.save()
            resolve({
              errCode: 4,
              errMessage: 'Quá thời gian nên không thể cập nhật',
            })
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Appoinment has been actived or not exist',
          })
        }
      }
    } catch(e){
      reject(e);
    }
  })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}
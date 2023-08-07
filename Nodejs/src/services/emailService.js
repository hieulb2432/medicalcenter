require('dotenv').config();
import nodemailer from 'nodemailer';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Medical Center" <hieu.lb2432@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmail(dataSend), // html body
  });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
      result = `<h3>Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked an online medical appointment on Medical Center</p>
      <p>Information to schedule an appointment:</p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor: ${dataSend.doctorName}</b></div>
      <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
      <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
      <div>Sincerely thank!</div>
    `;
    }
    if (dataSend.language === 'vi') {
      result = `<h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Medical Center</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <div><b>Thời gian: ${dataSend.time}</b></div>
      <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
      <p>Để hoàn tất thủ tục đặt lịch khám bệnh, vui lòng xác nhận thông tin trên bằng cách nhấp vào liên kết dưới đây.</p>
      <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
      <div>Xin chân thành cảm ơn!</div>
    `;
    }
    return result;
  };

  let sendCancelEmail = async (dataSend, email) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Medical Center" <hieu.lb2432@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Thông tin hủy lịch khám bệnh", // Subject line
      html: getBodyCancelEmail(dataSend), // html body
    });
  }
  
  let getBodyCancelEmail = (dataSend) => {
    let formattedDate = moment.unix(+dataSend.date / 1000).format('DD/MM/YYYY')

    let time = ''
    switch (dataSend.timeType) {
      case 'T1':  time = '8:00 - 9:00' 
      break;
      case 'T2':  time = '9:00 - 10:00' 
      break;
      case 'T3':  time = '10:00 - 11:00' 
      break;
      case 'T4':  time = '11:00-12:00' 
      break;
      case 'T5':  time = '13:00 - 14:00'  
      break;
      case 'T6':  time = '14:00 - 15:00' 
      break;
      case 'T7':  time = '15:00 - 16:00'  
      break;
      case 'T8':  time = '16:00 - 17:00' 
      break;
    }
      let result = '';
        result = `<h3>Xin chào bạn,</h3>
        <p>Tôi viết email này để thông báo rằng lịch khám của bạn đã bị hủy. Dưới đây là thông tin chi tiết:</p>
        <div><b>Ngày khám ban đầu: ${formattedDate}</b></div>
        <div><b>Thời gian khám ban đầu: ${time}</b></div>
        <p>Lý do hủy lịch khám có thể do một số yếu tố nằm ngoài tầm kiểm soát của chúng tôi, hoặc có thể do lịch trình bác sĩ bị thay đổi. Chúng tôi xin lỗi vì sự bất tiện này và rất mong hiểu được sự thông cảm của bạn.</p>
        <p>Để sắp xếp lại lịch khám hoặc biết thêm thông tin, vui lòng liên hệ với chúng tôi qua số hotline 0813300069. Chúng tôi sẽ cố gắng tìm lịch khám thích hợp cho bạn.</p>
        <p>Một lần nữa, chúng tôi thành thật xin lỗi vì sự phiền phức này. Rất mong sự thông cảm của bạn và mong được phục vụ bạn trong tương lai.</p>
        <div>Trân trọng</div>
      `;
      return result;
    };

  let sendTokenEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Medical Center" <hieu.lb2432@gmail.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Mã xem lịch sử khám bệnh", // Subject line
      html: getBodyTokenEmail(dataSend), // html body
    });
  }
  
  let getBodyTokenEmail = (dataSend) => {
    let result = '';
      result = `<h3>Xin chào bạn!</h3>
      <p>Vui lòng nhập mã sau để xem lịch sử khám bệnh: ${dataSend.id}</p>
      <div>Xin chân thành cảm ơn!</div>
    `;  
      return result;
    };

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendCancelEmail: sendCancelEmail,
    sendTokenEmail: sendTokenEmail
}
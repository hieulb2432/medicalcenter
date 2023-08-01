import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try{
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try{
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getHistoryAppointment = async (req, res) => {
    try{
        
        let infor = await patientService.getHistoryAppointment(req.query.email)
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllHistorySchedule = async (req, res) => {
    try{
        
        let infor = await patientService.getAllHistorySchedule(req.query.email, req.query.id)
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllBooking = async (req, res) => {
    try{
        
        let infor = await patientService.getAllBooking()
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getBookingCancelForPatient = async (req, res) => {
    try{
        let infor = await patientService.getBookingCancelForPatient(req.query.bookingId);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getHistoryAppointment: getHistoryAppointment,
    getAllHistorySchedule: getAllHistorySchedule,
    getAllBooking: getAllBooking,
    getBookingCancelForPatient: getBookingCancelForPatient
}
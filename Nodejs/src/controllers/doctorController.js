import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 15;

    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

let getAllDoctors = async (req, res) => {
    try{
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getOneDoctor = async (req, res) => {
    try{
        let doctor = await doctorService.getOneDoctor(req.query.id);
        return res.status(200).json(doctor);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try{
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try{
        
        let infor = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try{
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try{
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try{
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try{
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientForOneDoctor = async (req, res) => {
    try{
        let infor = await doctorService.getListPatientForOneDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getInforUserBooking = async (req, res) => {
    try{
        let infor = await doctorService.getInforUserBooking(req.query.doctorId, req.query.date, req.query.timeType);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleCancel = async (req, res) => {
    try{
        console.log('a',req.query)
        let infor = await doctorService.getScheduleCancel(req.query.doctorId, req.query.date, req.query.timeType);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendRemedy = async (req, res) => {
    try{
        let infor = await doctorService.sendRemedy(req.body);
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
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    getOneDoctor: getOneDoctor,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    getListPatientForOneDoctor: getListPatientForOneDoctor,
    getInforUserBooking: getInforUserBooking,
    getScheduleCancel: getScheduleCancel,
    sendRemedy: sendRemedy
}
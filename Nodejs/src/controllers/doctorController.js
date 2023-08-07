import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    // let limit = req.query.limit;
    // if(!limit) limit = 15;
    try {
        // let response = await doctorService.getTopDoctorHome(+limit);
        let response = await doctorService.getTopDoctorHome();
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

let getListSuccessPatient = async (req, res) => {
    try{
        let infor = await doctorService.getListSuccessPatient(req.query.doctorId, req.query.date);
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

let createPrescription = async (req, res) => {
    try{
        let infor = await doctorService.createPrescription(req.body);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getMedicalRecord = async (req, res) => {
    try{
        let infor = await doctorService.getMedicalRecord(req.query.patientId);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let createTest = async (req, res) => {
    try{
        let infor = await doctorService.createTest(req.body);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getTest = async (req, res) => {
    try{
        let infor = await doctorService.getTest(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendTest = async (req, res) => {
    try{
        let infor = await doctorService.sendTest(req.body);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getTestDone = async (req, res) => {
    try{
        let infor = await doctorService.getTestDone(req.query.doctorId, req.query.date);
        return res.status(200).json(infor);
    } catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getTestResult = async (req, res) => {
    try{
        let infor = await doctorService.getTestResult(req.query.bookingId);
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
    postInforDoctor: postInforDoctor,
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
import express from "express";
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController';
let router = express.Router();

let initWebRouters = (app) => {
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    router.post('/api/check-user-email', userController.checkUserEmail);
    router.get('/api/get-filter-user', userController.getFilterUser);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedue-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.get('/api/get-list-success-patient', doctorController.getListSuccessPatient);
    router.get('/api/get-list-patient-for-one-doctor', doctorController.getListPatientForOneDoctor);
    router.get('/api/get-infor-user-booking', doctorController.getInforUserBooking);
    router.get('/api/get-schedule-cancel', doctorController.getScheduleCancel);
    router.post('/api/create-prescription', doctorController.createPrescription);
    router.get('/api/get-medical-record', doctorController.getMedicalRecord);
    router.post('/api/create-test', doctorController.createTest);
    router.get('/api/get-test', doctorController.getTest);
    router.post('/api/send-test', doctorController.sendTest);
    router.get('/api/get-test-done', doctorController.getTestDone);
    router.get('/api/get-test-result', doctorController.getTestResult);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    router.get('/api/get-history-appointment', patientController.getHistoryAppointment);
    router.get('/api/get-all-history-schedule', patientController.getAllHistorySchedule);
    router.get('/api/get-all-booking', patientController.getAllBooking);
    router.get('/api/get-booking-cancel-for-patient', patientController.getBookingCancelForPatient);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty);
    router.put('/api/edit-specialty', specialtyController.handleEditSpecialty);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-filter-clinic', clinicController.getFilterClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic);
    router.put('/api/edit-clinic', clinicController.handleEditClinic);

    return app.use('/', router)
}

module.exports = initWebRouters
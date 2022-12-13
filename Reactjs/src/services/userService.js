import axios from '../axios';

const handleLoginApi = (email, password) => {
  console.log('acc')
  return axios.post('/api/login', {email, password});
};

export const getAllUsers = (id) => {
  return axios.get(`/api/get-all-users?id=${id}`);
}

export const createNewUserService = (data) => {
  return axios.post('/api/create-new-user', data);
}

export const deleteUserService = (id) => {
  return axios.delete('/api/delete-user', {data: {id}});
}

export const editUserService = (id) => {
  return axios.put('/api/edit-user', id);
}

export const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
}

export const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

export const getAllDoctorsService = () => {
  return axios.get(`/api/get-all-doctors`);
};

export const saveDetailDoctorService = (data) => {
  return axios.post('/api/save-infor-doctor', data);
};

export const getDetailInforDoctorService = (id) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};

export const saveBulkSchecduleDoctorService = (data) => {
  return axios.post('/api/bulk-create-schedule', data);
};

export const getScheduleDoctorByDateService = (doctorId, date) => {
  return axios.get(`/api/get-schedue-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

export const getExtraInforDoctorsService = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

export const getProfileDoctorByIdService = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

export const postPatientBookingService = (data) => {
  return axios.post('/api/patient-book-appointment', data);
};

export const postVerifyBookingService = (data) => {
  return axios.post('/api/verify-book-appointment', data);
};

export const createNewSpecialty = (data) => {
  return axios.post('/api/create-new-specialty', data);
};

export const getAllSpecialtyService = () => {
  return axios.get(`/api/get-all-specialty`);
};

export const getDetailSpecialtyByIdService = (data) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
};

export const createNewClinic = (data) => {
  return axios.post('/api/create-new-clinic', data);
};

export const getAllClinicService = () => {
  return axios.get(`/api/get-all-clinic`);
};

export const getDetailClinicByIdService = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};


export { 
  handleLoginApi,
}
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


export { 
  handleLoginApi,
}
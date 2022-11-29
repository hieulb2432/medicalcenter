import axios from '../axios';

const handleLoginApi = (email, password) => {
  console.log('acc')
  return axios.post('/api/login', {email, password});
};

export const getAllUsers = (id) => {
  return axios.get(`/api/get-all-users?id=${id}`);
}

export const createNewUserService = (data) => {
  console.log('check data from service', data);
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

export { 
  handleLoginApi,
}
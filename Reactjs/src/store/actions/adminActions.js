import actionTypes from './actionTypes';
import {getAllCodeService, createNewUserService, 
  getAllUsers, deleteUserService, editUserService,
  getTopDoctorHomeService, getAllDoctorsService,
  saveDetailDoctorService, getAllSpecialtyService,
  getAllClinicService, handleDeleteClinic, handleEditClinic, createNewClinic} from '../../services/userService';
import { toast } from 'react-toastify';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// })


export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START,
            })

            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0){
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch(e) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart failed', e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
})

export const fetchPositionStart = () => {
    return async (dispatch) => {
      try {
        let res = await getAllCodeService('position');
        if (res && res.errCode === 0) {
          dispatch(fetchPositionSuccess(res.data));
        } else {
          dispatch(fetchPositionFailed());
        }
      } catch (e) {
        dispatch(fetchPositionFailed());
      }
    };
  };

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
  });
  
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
  });

export const fetchRoleStart = () => {
    return async (dispatch) => {
      try {
        let res = await getAllCodeService('role');
        if (res && res.errCode === 0) {
          dispatch(fetchRoleSuccess(res.data));
        } else {
          dispatch(fetchRoleFailed());
        }
      } catch (e) {
        dispatch(fetchRoleFailed());
      }
    };
  };

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
  });
  
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
  });

export const createNewUser = (data) => {
    return async (dispatch) => {
      try {
        let res = await createNewUserService(data);
        if (res && res.errCode === 0) {
          toast.success('Create a new user succeed!');
          dispatch(saveUserSuccess());
          dispatch(fetchAllUsersStart());
        } else {
          dispatch(saveUserFailed());
        }
      } catch (e) {
        dispatch(saveUserFailed());
      }
    };
  };

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
  });
  
export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
  });

export const fetchAllUsersStart = () => {
    return async (dispatch) => {
      try {
        let res = await getAllUsers('ALL');
        if (res && res.errCode === 0) {
          dispatch(fetchAllUsersSuccess(res.users.reverse()));
        } else {
          dispatch(fetchAllUsersFailed());
        }
      } catch (e) {
        dispatch(fetchAllUsersFailed());
      }
    };
};

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
  });
  
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
  });

export const deleteUser = (id) => {
    return async (dispatch) => {
      try {
        let res = await deleteUserService(id);
        if (res && res.errCode === 0) {
          toast.success('Delete user succeed!');
          dispatch(deleteUserSuccess());
          dispatch(fetchAllUsersStart());
        } else {
          toast.error('Delete user error!');
          dispatch(deleteUserFailed());
        }
      } catch (e) {
        toast.error('Delete user error!');
        dispatch(deleteUserFailed());
      }
    };
  };

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
  });
  
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
  });

export const editUser = (id) => {
    return async (dispatch) => {
      try {
        let res = await editUserService(id);
        if (res && res.errCode === 0) {
          toast.success('Update user succeed!');
          dispatch(editUserSuccess());
          dispatch(fetchAllUsersStart());
        } else {
          toast.error('Update user error!');
          dispatch(deleteUserFailed());
        }
      } catch (e) {
        toast.error('Update user error!');
        dispatch(editUserFailed());
      }
    };
  };

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
  });
  
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
  });

export const fetchTopDoctor = () => {
    return async (dispatch) => {
      try {
        let res = await getTopDoctorHomeService('');
        if (res && res.errCode === 0) {
          dispatch({
            type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
            dataDoctors: res.data,
          });
        } else {
          dispatch({
            type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
          });
        }
      } catch (e) {
        console.log('Fetch Error', e);
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
        });
      }
    };
  };

export const fetchAllDoctors = () => {
    return async (dispatch) => {
      try {
        let res = await getAllDoctorsService();
        if (res && res.errCode === 0) {
          dispatch({
            type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
            dataDr: res.data,
          });
        } else {
          dispatch({
            type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
          });
        }
      } catch (e) {
        console.log('Fetch All Doctors Failed', e);
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
        });
      }
    };
  };

export const saveDetailDoctor = (data) => {
    return async (dispatch) => {
      try {
        let res = await saveDetailDoctorService(data);
        if (res && res.errCode === 0) {
          toast.success('Update user succeed!');
          dispatch({
            type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
          });
        } else {
          toast.error('Update user failed!');
          dispatch({
            type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
          });
        }
      } catch (e) {
        console.log('Save Doctors Failed', e);
        toast.error('Update user failed!');
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
        });
      }
    };
  };

export const fetchAllScheduleTime = () => {
    return async (dispatch) => {
      try {
        let res = await getAllCodeService('TIME');
        if (res && res.errCode === 0) {
          dispatch({
            type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
            dataTime: res.data,
          });
        } else {
          dispatch({
            type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
          });
        }
      } catch (e) {
        console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED', e);
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
        });
      }
    };
  };

  export const getRequiredDoctorInfor = () => {
    return async (dispatch) => {
      try {
        let resPrice = await getAllCodeService('PRICE');
        let resPayment = await getAllCodeService('PAYMENT');
        let resProvince = await getAllCodeService('PROVINCE');
        let resSpecialty = await getAllSpecialtyService();
        let resClinic = await getAllClinicService();
        if (resPrice && resPrice.errCode === 0
            && resPayment && resPayment.errCode === 0
            && resProvince && resProvince.errCode === 0
            && resSpecialty && resSpecialty.errCode === 0
            && resClinic && resClinic.errCode === 0
            ) {
              let data = {
                resPrice: resPrice.data,
                resProvince: resProvince.data,
                resPayment: resPayment.data,
                resSpecialty: resSpecialty.data,
                resClinic: resClinic.data,
              }
          dispatch({
            type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
            data: data,
          });
        } else {
          dispatch({
            type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
          });
        }
      } catch (e) {
        console.log('FETCH_REQUIRED_DOCTOR_INFOR_FAILED', e);
        dispatch({
          type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
        });
      }
    };
  };

  export const fetchAllClinicsStart = () => {
    return async (dispatch) => {
      try {
        let res = await getAllClinicService();
        if (res && res.errCode === 0) {
          dispatch(fetchAllClinicsSuccess(res.data));
        } else {
          dispatch(fetchAllClinicsFailed());
        }
      } catch (e) {
        dispatch(fetchAllClinicsFailed());
      }
    };
};

export const fetchAllClinicsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_CLINIC_SUCCESS,
    clinics: data
  });
  
export const fetchAllClinicsFailed = () => ({
    type: actionTypes.FETCH_ALL_CLINIC_FAILED,
  });

export const fetchCreateNewClinic = (data) => {
  return async (dispatch) => {
    try {
      let res = await createNewClinic(data);
      if (res && res.errCode === 0) {
        toast.success('Thêm mới thành công!');
        dispatch(saveClinicSuccess());
        dispatch(fetchAllClinicsStart());
      } else {
        // toast.error('Thêm mới thất bại');
        dispatch(saveClinicFailed());
      }
    } catch (e) {
      toast.error('Thêm mới thất bại');
      dispatch(saveClinicFailed());
    }
  };
};

export const saveClinicSuccess = () => ({
  type: actionTypes.CREATE_CLINIC_SUCCESS,
});

export const saveClinicFailed = () => ({
  type: actionTypes.CREATE_CLINIC_FAILED,
});

export const deleteClinic = (id) => {
    return async (dispatch) => {
      try {
        let res = await handleDeleteClinic(id);
        console.log('deleteClinic', res);
        if (res && res.errCode === 0) {
          toast.success('Xóa thành công');
          dispatch(deleteClinicSuccess());
          dispatch(fetchAllClinicsStart());
        } else {
          toast.error('Không thể xóa do đang liên kết với bác sĩ');
          dispatch(deleteClinicFailed());
        }
      } catch (e) {
        toast.error('Xóa thất bại!');
        dispatch(deleteClinicFailed());
      }
    };
  };

export const deleteClinicSuccess = () => ({
    type: actionTypes.DELETE_CLINIC_SUCCESS,
  });
  
export const deleteClinicFailed = () => ({
    type: actionTypes.DELETE_CLINIC_FAILED,
  });

export const editClinic = (data) => {
    return async (dispatch) => {
      try {
        let res = await handleEditClinic(data);
        if (res && res.errCode === 0) {
          toast.success('Chỉnh sử thành công');
          dispatch(editClinicSuccess());
          dispatch(fetchAllClinicsStart());
        } else {
          // toast.error('Chỉnh sửa thất bại!');
          dispatch(deleteClinicFailed());
        }
      } catch (e) {
        toast.error('Chỉnh sửa thất bại!');
        dispatch(editClinicFailed());
      }
    };
  };

export const editClinicSuccess = () => ({
    type: actionTypes.EDIT_CLINIC_SUCCESS,
  });
  
export const editClinicFailed = () => ({
    type: actionTypes.EDIT_CLINIC_FAILED,
  });

import actionTypes from './actionTypes';
import {getAllCodeService, createNewUserService, 
  getAllUsers, deleteUserService, editUserService,
  getTopDoctorHomeService, getAllDoctorsService,
  saveDetailDoctorService} from '../../services/userService';
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
    type: actionTypes.DELETE_USER_FAILED,
  });
  
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
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
    type: actionTypes.EDIT_USER_FAILED,
  });
  
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
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
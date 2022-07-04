import axios from 'axios';
import baseURL from '../baseURL';
import {
  SET_LOADING,
  SET_ERROR,
  GET_PROFILE,
  CLEAR_ERROR,
  EDIT_PROFILE,
  SET_SUCCESS,
  GET_USERS,
  GET_USER,
  CHANGE_WORK_STATUS,
  RESET_PASSWORD,
} from './types';

export const getProfile = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/profile/${id}`, config);

    dispatch({
      type: GET_PROFILE,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/profile/${id}`, config);

    dispatch({
      type: GET_USER,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/profile`, config);

    dispatch({
      type: GET_USERS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const changeWorkStatus = (body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/profile/changeWorkStatus`,
      body,
      config
    );

    dispatch({
      type: CHANGE_WORK_STATUS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const reset_new_password = (body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch(setSuccess());
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    await axios.put(`${baseURL}/api/users/reset_new_password`, body, config);

    dispatch({
      type: RESET_PASSWORD,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const editProfile = (dp, cover, data) => async (dispatch, getState) => {
  const formData = new FormData();
  const body = JSON.stringify(data);
  formData.append('dp', dp);
  formData.append('cover', cover);
  formData.append('data', body);
  try {
    dispatch({
      type: SET_SUCCESS,
    });
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    await axios.put(`${baseURL}/api/profile`, formData, config);

    dispatch({
      type: EDIT_PROFILE,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: 'You can upload only jpg, jpeg, png format',
    });
  }
};

// Set loading to true
export const setLoading = () => async (dispatch) => {
  dispatch({
    type: SET_LOADING,
  });
};
export const setSuccess = () => async (dispatch) => {
  dispatch({
    type: SET_SUCCESS,
  });
};

import axios from 'axios';
import baseURL from '../baseURL';
import {
  SET_LOADING,
  SET_ERROR,
  GET_PROFILE,
  CLEAR_ERROR,
  EDIT_PROFILE,
  SET_SUCCESS,
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

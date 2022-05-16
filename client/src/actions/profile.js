import axios from 'axios';
import baseURL from '../baseURL';
import { SET_LOADING, SET_ERROR, GET_PROFILE } from './types';

export const getProfile = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
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

// Set loading to true
export const setLoading = () => async (dispatch) => {
  dispatch({
    type: SET_LOADING,
  });
};

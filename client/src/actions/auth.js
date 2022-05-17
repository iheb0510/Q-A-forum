import axios from 'axios';
import baseURL from '../baseURL';
import {
  LOGOUT,
  REGISTER,
  LOGIN,
  SET_LOADING,
  SET_ERROR,
  FORGET_PASSWORD,
  RECOVER_PASSWORD,
  ACTIVATE_ACCOUNT,
  CLEAR_ERROR,
} from './types';

export const register = (user) => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const body = JSON.stringify(user);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`${baseURL}/api/users/`, body, config);

    dispatch({
      type: REGISTER,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    console.log('aaa');
    const body = JSON.stringify(credentials);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`${baseURL}/api/auth`, body, config);

    dispatch({
      type: LOGIN,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: LOGOUT,
    });
    localStorage.removeItem('userInfo');
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.statusText,
    });
  }
};

export const activateAccount = (token) => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/users/activate`,
      { token },
      config
    );
    dispatch({
      type: ACTIVATE_ACCOUNT,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const forgetPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      `${baseURL}/api/users/forget_password`,
      { email },
      config
    );

    dispatch({
      type: FORGET_PASSWORD,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const resetPassword =
  (token, new_password, confirm_password) => async (dispatch) => {
    try {
      dispatch({
        type: SET_LOADING,
      });
      dispatch({
        type: CLEAR_ERROR,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios.post(
        `${baseURL}/api/users/reset_password`,
        { token, new_password, confirm_password },
        config
      );

      dispatch({
        type: RECOVER_PASSWORD,
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
export const clearError = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
  });
};

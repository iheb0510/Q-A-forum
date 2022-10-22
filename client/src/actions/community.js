import axios from 'axios';
import baseURL from '../baseURL';
import {
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  GET_ALL_COMMUNITIES,
  GET_ALL_MY_COMMUNITIES,
  ADD_COMMUNITY,
  EDIT_COMMUNITY,
  GET_COMMUNITY,
  DELETE_COMMUNITY,
  JOIN_COMMUNITY,
  EXIT_COMMUNITY,
  GET_REQUESTS,
  ACCEPT_REQUEST,
  REFUSE_REQUEST,
  DELETE_REQUEST,
} from './types';

export const getAllCommunities = () => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });

    const { data } = await axios.get(`${baseURL}/api/community`);

    dispatch({
      type: GET_ALL_COMMUNITIES,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getAllMyCommunities = () => async (dispatch) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });

    const { data } = await axios.get(`${baseURL}/api/community/me`);

    dispatch({
      type: GET_ALL_MY_COMMUNITIES,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const addCommunity = (dp, cover, data) => async (dispatch, getState) => {
  const formData = new FormData();
  const body = JSON.stringify(data);
  formData.append('dp', dp);
  formData.append('cover', cover);
  formData.append('data', body);
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
        'Content-Type': 'multipart/form-data',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const res = await axios.post(`${baseURL}/api/community`, formData, config);
    Promise.all(console.log('response', res.data));
    dispatch({
      type: ADD_COMMUNITY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: 'You can upload only jpg, jpeg, png format',
    });
  }
};

export const editCommunity =
  (dp, cover, data, id) => async (dispatch, getState) => {
    const formData = new FormData();
    const body = JSON.stringify(data);
    formData.append('dp', dp);
    console.log('dpp', dp);
    formData.append('cover', cover);
    formData.append('data', body);
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
          'Content-Type': 'multipart/form-data',
          'x-auth-token': `${userInfo.token}`,
        },
      };
      let { data } = await axios.put(
        `${baseURL}/api/community/${id}`,
        formData,
        config
      );
      console.log('d', data);
      dispatch({
        type: EDIT_COMMUNITY,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data.message,
      });
    }
  };

export const joinCommunity = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.put(
      `${baseURL}/api/community/join/${id}`,
      {},
      config
    );

    dispatch({
      type: JOIN_COMMUNITY,
      payload: { id, community: data.community, requests: data.requests },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const exitCommunity = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.put(
      `${baseURL}/api/community/exit/${id}`,
      {},
      config
    );
    dispatch({
      type: EXIT_COMMUNITY,
      payload: { id, community: data.community, requests: data.requests },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const acceptRequest = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.put(
      `${baseURL}/api/community/accept/${id}`,
      {},
      config
    );

    dispatch({
      type: ACCEPT_REQUEST,
      payload: id,
      a: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};
export const refuseRequest = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.put(
      `${baseURL}/api/community/refuse/${id}`,
      {},
      config
    );

    dispatch({
      type: REFUSE_REQUEST,
      payload: id,
      a: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const deleteRequest = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.delete(
      `${baseURL}/api/community/deleteRequest/${id}`,
      config
    );

    dispatch({
      type: DELETE_REQUEST,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getRequests = () => async (dispatch, getState) => {
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
    const { data } = await axios.get(
      `${baseURL}/api/community/requestsMe`,
      config
    );

    dispatch({
      type: GET_REQUESTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getMyRequests = () => async (dispatch, getState) => {
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
    const { data } = await axios.get(
      `${baseURL}/api/community/requests`,
      config
    );

    dispatch({
      type: GET_REQUESTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getCommunity = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.get(`${baseURL}/api/community/${id}`, config);

    dispatch({
      type: GET_COMMUNITY,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const deleteCommunity = (id) => async (dispatch, getState) => {
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
    const { data } = await axios.put(
      `${baseURL}/api/community/delete/${id}`,
      config
    );

    dispatch({
      type: DELETE_COMMUNITY,
      payload: id,
      a: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

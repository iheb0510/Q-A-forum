import axios from 'axios';
import baseURL from '../baseURL';
import {
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  CHAT_DELETE,
  CREATE_CHAT_ROOM,
  GET_CHAT_ROOMS,
  SET_SUCCESS,
} from './types';

// Get chat rooms
export const getChatRooms = (userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    dispatch({
      type: SET_SUCCESS,
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
      `${baseURL}/api/chat/getChatRooms/${userId}`,
      config
    );
    dispatch({
      type: GET_CHAT_ROOMS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response.data.message,
    });
  }
};

// Create chat rooms
export const createChatRoom = (roomInfo) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    dispatch({
      type: SET_SUCCESS,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    await axios.post(`${baseURL}/api/chat/createNewRoom`, roomInfo, config);
    dispatch({
      type: CREATE_CHAT_ROOM,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response.data.message,
    });
  }
};
// Delete a Chat
export const deleteChat = (roomId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    dispatch({
      type: SET_SUCCESS,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    await axios.delete(`${baseURL}/api/chat/deleteChat/${roomId}`, config);
    dispatch({
      type: CHAT_DELETE,
      payload: roomId,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response.data.message,
    });
  }
};

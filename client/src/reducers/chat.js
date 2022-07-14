import {
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  CHAT_DELETE,
  CREATE_CHAT_ROOM,
  GET_CHAT_ROOMS,
  SET_SUCCESS,
} from '../actions/types';

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  Success: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_ROOMS:
      return {
        ...state,
        rooms: action.payload,
        loading: false,
        success: true,
      };
    case CREATE_CHAT_ROOM:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case CHAT_DELETE:
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.roomId !== action.payload),
        loading: false,
        success: true,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_SUCCESS:
      return {
        ...state,
        success: false,
      };
    case SET_ERROR:
      console.error(action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false,
        sucess: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

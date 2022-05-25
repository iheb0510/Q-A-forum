import {
  SET_LOADING,
  SET_ERROR,
  GET_PROFILE,
  EDIT_PROFILE,
  CLEAR_ERROR,
  SET_SUCCESS,
  GET_USERS,
  GET_USER,
} from '../actions/types';

const initialState = {
  user: {},
  users: [],
  current: {},
  loading: false,
  error: null,
  Success: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        user: action.payload,
        success: false,
        loading: false,
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case GET_USER:
      return {
        ...state,
        current: action.payload,
        loading: false,
      };
    case EDIT_PROFILE:
      return {
        ...state,
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

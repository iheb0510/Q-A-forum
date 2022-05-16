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
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  userInfo: {},
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER:
      return {
        ...state,
        loading: false,
      };
    case LOGIN:
      return {
        ...state,
        userInfo: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case LOGOUT:
      return {
        ...state,
        userInfo: {},
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case FORGET_PASSWORD:
      return {
        ...state,
        loading: false,
      };
    case RECOVER_PASSWORD:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ACTIVATE_ACCOUNT:
      return {
        ...state,
        userInfo: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case SET_ERROR:
      console.error(action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

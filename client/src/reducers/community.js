import {
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  GET_ALL_COMMUNITIES,
  ADD_COMMUNITY,
  EDIT_COMMUNITY,
  DELETE_COMMUNITY,
  JOIN_COMMUNITY,
  GET_REQUESTS,
  ACCEPT_REQUEST,
  REFUSE_REQUEST,
  GET_COMMUNITY,
} from '../actions/types';

const initialState = {
  communities: [],
  requests: [],
  community: {},
  loading: false,
  error: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_COMMUNITIES:
      return {
        ...state,
        communities: action.payload,
        loading: false,
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        loading: false,
      };
    case GET_COMMUNITY:
      return {
        ...state,
        community: action.payload,
        loading: false,
      };
    case ACCEPT_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(
          (request) => request._id !== action.payload
        ),
        loading: false,
      };
    case REFUSE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(
          (request) => request._id !== action.payload
        ),
        loading: false,
      };
    case JOIN_COMMUNITY:
      return {
        ...state,
        loading: false,
        communities: state.communities.map((community) =>
          community._id === action.payload.community._id ? action.payload.community : community 
        ),
        requests : action.payload.requests
      };
    case ADD_COMMUNITY:
      return {
        ...state,
        communities: [...state.communities, action.payload],
        loading: false,
      };
    case DELETE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.filter(
          (community) => community._id !== action.payload
        ),
        loading: false,
      };
    case EDIT_COMMUNITY:
      return {
        ...state,
        communities: state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community
        ),

        community: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
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

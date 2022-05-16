import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import rootReducer from './reducers';

const verifyToken = (token, lsItem) => {
  const currentDate = new Date();
  const decodeToken = jwtDecode(token);
  if (currentDate.getTime() > decodeToken.exp * 1000) {
    localStorage.removeItem(lsItem);
    return false;
  } else return true;
};

const initialState = {
  auth: {
    isAuthenticated: localStorage.getItem('userInfo')
      ? verifyToken(
          JSON.parse(localStorage.getItem('userInfo')).token,
          'userInfo'
        )
      : false,
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {},
    loading: false,
    error: null,
  },
};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

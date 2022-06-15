import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import community from './community';

export default combineReducers({
  auth,
  profile,
  community,
});

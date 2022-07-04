import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import community from './community';
import question from './question';
import chat from './chat';

export default combineReducers({
  auth,
  profile,
  community,
  question,
  chat,
});

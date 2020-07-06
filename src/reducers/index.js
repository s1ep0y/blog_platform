import { combineReducers } from 'redux';
import userReducers from './user';
import articleReducers from './articles';



export default combineReducers({
  userReducers,
  articleReducers
});

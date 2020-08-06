import { combineReducers } from 'redux';
import mapReducer from './mapReducer';
import appReducer from './appReducer';

const rootReducer = combineReducers({
    keplerGl: mapReducer,
    app: appReducer
});

export default rootReducer;
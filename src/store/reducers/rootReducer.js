import { combineReducers } from 'redux';
import { keplerGlReducer } from 'kepler.gl/reducers';
import { appReducer } from './appReducer';

const rootReducer = combineReducers({
    keplerGl: keplerGlReducer,
    app: appReducer
});

export default rootReducer;
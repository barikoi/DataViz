import { combineReducers } from 'redux';
import { keplerGlReducer } from 'kepler.gl/reducers';

const rootReducer = combineReducers({
    keplerGl: keplerGlReducer
});

export default rootReducer;
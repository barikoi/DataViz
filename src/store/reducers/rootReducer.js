import { combineReducers } from 'redux';
import { keplerGlReducer } from 'kepler.gl/reducers';
import { appReducer } from './appReducer';
import { ActionTypes } from 'kepler.gl/actions'

const customKeplerGlReducer = keplerGlReducer.plugin({
    [ActionTypes.MAP_CLICK]: (state, action) => {
        console.log('Override Map Click')
        return {

        }
    }
})

const rootReducer = combineReducers({
    keplerGl: customKeplerGlReducer,
    app: appReducer
});

export default rootReducer;
import { combineReducers } from 'redux';
import keplerGlReducer, { visStateUpdaters } from 'kepler.gl/reducers';

const customKeplerReducer =  keplerGlReducer.initialState({
    uiState: {
        // hide side panel to disallow user customize the map
        readOnly: true,
        currentModal: null
    }
});

const rootReducer = combineReducers({
    keplerGl: customKeplerReducer,
    visState: visStateUpdaters
});

export default rootReducer;
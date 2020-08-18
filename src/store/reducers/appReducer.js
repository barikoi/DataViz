import * as Types from '../actions/actionTypes';

const initialState = {
    isDataLoaded: false
};

export function appReducer(state=initialState, action) {
    switch(action.type) {
        case Types.SET_IS_DATA_LOADED_TRUE:
            return {
                ...state,
                isDataLoaded: true
            };
        default: return state;
    }
}
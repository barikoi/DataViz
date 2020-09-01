import * as ActionTypes from './actionTypes';

// Dispatch toggleTopLayer
export function dispatchSetTopLayer(topLayerIndex) {
    return (dispatch) => {
        dispatch({ type: ActionTypes.SET_TOP_LAYER, payload: { topLayerIndex } });
    }
}

// Dispatch Set Current Layer
export function dispatchSetCurrentLayer(selectedLayer) {
    return (dispatch) => {
        // Dispatch Set Current Layer Action
        dispatch({ type: ActionTypes.SET_SELECTED_LAYER, payload: { selectedLayer }});
    }
}

// Dispatch Set Current Time Filter Action
export function dispatchSetCurrentTimeFilter(currentTimeFilterIndex) {
    return (dispatch) => {
        dispatch({ type: ActionTypes.SET_CURRENT_TIME_FILTER, payload: { currentTimeFilterIndex } });
    }
}

// Dispatch Time Filter View
export function dispatchToggleTimeFilterView() {
    return (dispatch) => {
        // Dispatch Toggle Time Filter View Action
        dispatch({ type: ActionTypes.TOGGLE_TIME_FILTER_VIEW });
    }
}

// Dispatch Set Birds Eye Selected Field
export function dispatchBirdsEyeSelectedField(selectedField) {
    return (dispatch) => {
        // Dispatch Set Birds Eye Selected Field Action
        dispatch({ type: ActionTypes.SET_BIRDS_EYE_SELECTED_FIELD, payload: { selectedField } });
    }
}

// Dispatch Set Birds Eye Selected Filter Value
export function dispatchBirdsEyeSelectedFilterValue(selectedValue) {
    return (dispatch) => {
        // Dispatch Set Birds Eye Selected Filter Value Action
        dispatch({ type: ActionTypes.SET_BIRDS_EYE_SELECTED_FILTER_VALUE, payload: { selectedValue } });
    }
}

// Dispatch Vault Selected Field
export function dispatchVaultSelectedField(selectedField) {
    return (dispatch) => {
        // Dispatch Set Vault Selected Field Action
        dispatch({ type: ActionTypes.SET_VAULT_SELECTED_FIELD, payload: { selectedField } });
    }
}

// Dispatch Set Vault Selected Filter Value
export function dispatchVaultSelectedFilterValue(selectedValue) {
    return (dispatch) => {
        // Dispatch Set Vault Selected Filter Value Action
        dispatch({ type: ActionTypes.SET_VAULT_SELECTED_FILTER_VALUE, payload: { selectedValue } });
    }
}
import { wrapTo, setFilter, enlargeFilter } from 'kepler.gl/actions';
import * as ActionTypes from './actionTypes';

// Set Current Time Filter Enlarged
export function setCurrentTimeFilterEnlarged(currentTimeFilterIndex) {
    return (dispatch) => {
        dispatch( wrapTo('map', enlargeFilter(currentTimeFilterIndex)) );
    }
}

// Toggle Time Filter Visibility
export function toggleAllTimeFilterView(timeFilter) {
    return (dispatch, getState) => {
        if(timeFilter) {
            let { currentTimeFilterIndex } = getState().app.sidePanel;

            // Set current time filter enlarged
            dispatch( wrapTo('map', enlargeFilter(currentTimeFilterIndex)) );

        } else {
            // Get All existing Time Filters
            let { filters } = getState().keplerGl.map.visState;
            
            // Set All Time Filter enlarged to false
            for(let i = 0; i < filters.length; i++) {
                if(filters[i].type === 'timeRange') {
                    dispatch( wrapTo('map', setFilter(i, 'enlarged', false, 0)) );
                }
            }
        }
    }
}

// Set Birds Eye multi-select filter name to current field
export function handleBirdsEyeFilterFieldSelect(selectedField) {
    return (dispatch, getState) => {
        // If 'None' is selected
        if(selectedField.id === 0) {
            // Dispatch Set Birds Eye Value Dropdown List action to reset values
            dispatch({ type: ActionTypes.SET_BIRDS_EYE_VALUE_DROPDOWN_LIST, payload: { valueDropdownList: [] } });

            // Dispatch Set Color Field By
            dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy: { id: 0, tableField: '' } } });

        } else {
            // Dispatch setFilter action to filter index 2 which is multiSelect for birds-eye in config
            dispatch( wrapTo('map', setFilter(2, 'name', selectedField.tableField, 0)) );

            // Populate Birds Eye Filter Values based on Selected Field
            let { domain } = getState().keplerGl.map.visState.filters[2];

            // Build Value Dropdown List
            let valueDropdownList = [ { id: 0, label: 'None', tableField: '' } ];
            let id = 1;
            domain.forEach(item => {
                valueDropdownList.push({ id, label: item, tableField: item });
                id++;
            });

            // Dispatch Set Birds Eye Value Dropdown List action
            dispatch({ type: ActionTypes.SET_BIRDS_EYE_VALUE_DROPDOWN_LIST, payload: { valueDropdownList } });

            // If Single Layer Selected, Set Color Field By
            let { selectedLayer } = getState().app.sidePanel;
            
            if(selectedLayer.id !== 0) {
                // Dispatch Set Color Field By action
                dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy: selectedField } });
            }
        }

        // Reset filter values in keplerGl Map reducer
        dispatch( wrapTo('map', setFilter(2, 'value', [], 0)) );
    }
}


// Set Vault multi-select filter name to current field
export function handleVaultFilterFieldSelect(selectedField) {
    return (dispatch, getState) => {
        // If 'None' is selected
        if(selectedField.id === 0) {
            // Dispatch Set Vault Value Dropdown List action to reset values
            dispatch({ type: ActionTypes.SET_VAULT_VALUE_DROPDOWN_LIST, payload: { valueDropdownList: [] } });

            // Dispatch Set Color Field By
            dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy: { id: 0, tableField: '' } } });

        } else {
            // Dispatch setFilter action to filter index 3 which is multiSelect for vault in config
            dispatch( wrapTo('map', setFilter(3, 'name', selectedField.tableField, 0)) );

            // Populate Vault Filter Values based on Selected Field
            let { domain } = getState().keplerGl.map.visState.filters[3];

            // Build Value Dropdown List
            let valueDropdownList = [ { id: 0, label: 'None', tableField: '' } ];
            let id = 1;
            domain.forEach(item => {
                valueDropdownList.push({ id, label: item, tableField: item });
                id++;
            });

            // Dispatch Set Birds Eye Value Dropdown List action
            dispatch({ type: ActionTypes.SET_VAULT_VALUE_DROPDOWN_LIST, payload: { valueDropdownList } });

            // If Single Layer Selected, Set Color Field By
            let { selectedLayer } = getState().app.sidePanel;
            
            if(selectedLayer.id !== 0) {
                // Dispatch Set Color Field By action
                dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy: selectedField } });
            }
        }

        // Reset filter values in keplerGl reducer
        dispatch( wrapTo('map', setFilter(3, 'value', [], 0)) );
    }
}

// Handle Birds Eye Filter Value Select
export function handleBirdsEyeFilterValueSelect(selectedValue) {
    return (dispatch) => {
        // If 'None' selected
        if(selectedValue.id === 0) {
            // Reset Filter Value
            dispatch( wrapTo('map', setFilter(2, 'value', [], 0)) );

        } else {
            // Dispatch Filter Value to selectedValue.tableField
            dispatch( wrapTo('map', setFilter(2, 'value', [ selectedValue.tableField ], 0)) );
        }
    }
}

// Handle Vault Filter Value Select
export function handleVaultFilterValueSelect(selectedValue) {
    return (dispatch) => {
        // If 'None' selected
        if(selectedValue.id === 0) {
            // Reset Filter Value
            dispatch( wrapTo('map', setFilter(3, 'value', [], 0)) );

        } else {
            // Dispatch Filter Value to selectedValue.tableField
            dispatch( wrapTo('map', setFilter(3, 'value', [ selectedValue.tableField ], 0)) );
        }
    }
}
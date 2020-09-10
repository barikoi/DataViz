import * as ActionTypes from '../actions/actionTypes';

const initialState = {
    sidePanel: {
        isDataLoaded: false,
        topLayerIndex: 0,
        timeFilter: true,
        currentTimeFilterIndex: 0,
        layerDropdownList: [
            { id: 0, layerIndex: -1, label: 'All', dataId: '' },
            { id: 1, layerIndex: 0, label: 'Bird\'s Eye', dataId: 'birds_eye_point_data' },
            { id: 2, layerIndex: 1, label: 'Vault', dataId: 'vault_point_data' }
        ],
        selectedLayer: { id: 0, layerIndex: -1, label: 'All', tableField: '' },
        fieldDropdownList: {
            birdsEye: [
                { id: 0, tableIndex: -1, type: '', label: 'None', tableField: '' },
                { id: 1, tableIndex: 4, type: 'string', label: 'Place Type', tableField: 'pType' },
                { id: 2, tableIndex: 5, type: 'string', label: 'Sub Type', tableField: 'subType' },
                { id: 3, tableIndex: 3, type: 'string', label: 'Area', tableField: 'area' },
                { id: 4, tableIndex: 9, type: 'string', label: 'User ID', tableField: 'user_id' }
            ],
            vault: [
                { id: 0, tableIndex: -1, type: '', label: 'None', tableField: '' },
                { id: 1, tableIndex: 9, type: 'string', label: 'Place Type', tableField: 'pType' },
                { id: 2, tableIndex: 8, type: 'string', label: 'Sub Type', tableField: 'subType' },
                { id: 3, tableIndex: 6, type: 'string', label: 'Area', tableField: 'area' },
                { id: 4, tableIndex: 5, type: 'string', label: 'City', tableField: 'city' },
                { id: 5, tableIndex: 11, type: 'string', label: 'User ID', tableField: 'user_id' }
            ]
        },
        selectedField: {
            birdsEye: { id: 0, tableIndex: -1, type: '', label: 'None', tableField: '' },
            vault: { id: 0, tableIndex: -1, type: '', label: 'None', tableField: '' }
        },
        valueDropdownList: {
            birdsEye: [],
            vault: []
        },
        selectedValue: {
            birdsEye: {},
            vault: {}
        },
        colorFieldBy: { id: 0, tableField: '' },
        polygonModal: false,
        polygonPoints: {
            birdsEye: [],
            vault: []
        },
        isUpdateModalOpen: false,
        updateModalInputData: {}
    }
};

export function appReducer(state=initialState, action) {
    switch(action.type) {
        case ActionTypes.SET_IS_DATA_LOADED_TRUE:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    isDataLoaded: true
                }
            };
        case ActionTypes.SET_TOP_LAYER:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    topLayerIndex: action.payload.topLayerIndex
                }
            };
        case ActionTypes.SET_SELECTED_LAYER:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    selectedLayer: action.payload.selectedLayer
                }
            };
        case ActionTypes.TOGGLE_TIME_FILTER_VIEW:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    timeFilter: !state.sidePanel.timeFilter
                }
            };
        case ActionTypes.SET_CURRENT_TIME_FILTER:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    currentTimeFilterIndex: action.payload.currentTimeFilterIndex
                }
            };
        case ActionTypes.SET_BIRDS_EYE_SELECTED_FIELD:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    selectedField: {
                        ...state.sidePanel.selectedField,
                        birdsEye: action.payload.selectedField
                    }
                }
            };
        case ActionTypes.SET_VAULT_SELECTED_FIELD:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    selectedField: {
                        ...state.sidePanel.selectedField,
                        vault: action.payload.selectedField
                    }
                }
            };
        case ActionTypes.SET_BIRDS_EYE_VALUE_DROPDOWN_LIST:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    valueDropdownList: {
                        ...state.sidePanel.valueDropdownList,
                        birdsEye: action.payload.valueDropdownList
                    }
                }
            };
        case ActionTypes.SET_VAULT_VALUE_DROPDOWN_LIST:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    valueDropdownList: {
                        ...state.sidePanel.valueDropdownList,
                        vault: action.payload.valueDropdownList
                    }
                }
            };
        case ActionTypes.SET_BIRDS_EYE_SELECTED_FILTER_VALUE:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    selectedValue: {
                        ...state.sidePanel.selectedValue,
                        birdsEye: action.payload.selectedValue
                    }
                }
            };
        case ActionTypes.SET_VAULT_SELECTED_FILTER_VALUE:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    selectedValue: {
                        ...state.sidePanel.selectedValue,
                        vault: action.payload.selectedValue
                    }
                }
            };
        case ActionTypes.SET_COLOR_FIELD_BY:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    colorFieldBy: action.payload.colorFieldBy
                }
            };
        case ActionTypes.SET_POLYGON_MODAL:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    polygonModal: action.payload.polygonModal
                }
            };
        case ActionTypes.SET_IS_UPDATE_MODAL_OPEN:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    isUpdateModalOpen: action.payload.isUpdateModalOpen
                }
            };
        case ActionTypes.SET_UPDATE_MODAL_INPUT_DATA:
            return {
                ...state,
                sidePanel: {
                    ...state.sidePanel,
                    updateModalInputData: action.payload.updateModalInputData
                }
            };
        default: return state;
    }
}
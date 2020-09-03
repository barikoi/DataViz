import { wrapTo, reorderLayer, layerConfigChange, layerVisualChannelConfigChange } from 'kepler.gl/actions';
import * as ActionTypes from './actionTypes';

// Toggle Top Layer when both selected
export function toggleTopLayer() {
    return (dispatch, getState) => {
        // Get Current layer order array
        let { layerOrder } = getState().keplerGl.map.visState;

        // Reverse layerOrder Array
        let newLayerOrder = layerOrder.reverse();

        // Dispatch 'reorderLayer' action
        dispatch( wrapTo('map', reorderLayer(newLayerOrder)) );
    }
}

export function setCurrentLayerVisibleOnly(selectedLayer) {
    return (dispatch, getState) => {
        // Set Only Current Layer Visible
        let { layers } = getState().keplerGl.map.visState;

        // If 'All' selected
        if(selectedLayer.id === 0) {
            for(let i = 0; i < layers.length; i++) {
                // Dispatch Layer Config Change
                dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: true })) );
            }

            // Dispatch Set Color Field By
            dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy: { id: 0, tableField: '' } } });

        } else {
            for(let i = 0; i < layers.length; i++) {
                if(i !== selectedLayer.layerIndex) {
                    // Dispatch Layer Config Change
                    dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: false })) );
                } else {
                    // Dispatch Layer Config Change
                    dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: true })) );
                }
            }

            // Set Color Field By if field dropdown not 'None'
            let colorFieldBy = {};
            if(selectedLayer.id === 1) {
                let { birdsEye } = getState().app.sidePanel.selectedField;
                if(birdsEye.id !== 0) {
                    colorFieldBy = birdsEye;
                }

            } else if(selectedLayer.id === 2) {
                let { vault } = getState().app.sidePanel.selectedField;
                if(vault.id !== 0) {
                    colorFieldBy = vault;
                }
            }

            // Dispatch Set Color Field By
            dispatch({ type: ActionTypes.SET_COLOR_FIELD_BY, payload: { colorFieldBy } });
        }
    }
}

// Handle Color Field By Change
export function handleColorFieldByChange(colorFieldBy) {
    return (dispatch, getState) => {
        let { selectedLayer } = getState().app.sidePanel;

        // If 'All' layer is selected
        if(selectedLayer.id === 0) {
            // Dispatch all layers colorfield to null
            let { layers } = getState().keplerGl.map.visState;
            layers.forEach(item => {
                // Dispatch Vis Config Change action
                dispatch( wrapTo('map', layerVisualChannelConfigChange(item, { colorField: null }, 'color')) );
            });

        } else {
            // Get old layer
            let oldLayerObj = getState().keplerGl.map.visState.layers[ selectedLayer.layerIndex ];

            // Type To Analyzer Type Map
            const type = [ 'string', 'integer' ];
            const analyzerType = [ 'STRING', 'INT' ];

            // Build new Color Field by Config
            let newConfig = {};

            // If new ColorField By is valied
            if(colorFieldBy.tableField !== '') {
                newConfig = {
                    colorField: {
                        analyzerType: analyzerType[type.indexOf(colorFieldBy.type)],
                        format: '',
                        id: colorFieldBy.tableField,
                        name: colorFieldBy.tableField,
                        tableFieldIndex: colorFieldBy.tableIndex,
                        type: colorFieldBy.type,
                    }
                };
            } else {
                // If new Color Field By is empty
                newConfig = {
                    colorField: null
                };
            }

            // Dispatch Vis Config Change action
            dispatch( wrapTo('map', layerVisualChannelConfigChange(oldLayerObj, newConfig, 'color')) );
        }
    }
}
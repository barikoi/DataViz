import { wrapTo, addDataToMap, updateMap, layerConfigChange } from 'kepler.gl/actions';
import { processRowObject } from 'kepler.gl/processors';
import { fetchAPIData } from './actionUtils';
import * as Types from './actionTypes';

import mapConfig from '../../configs/ctg_sylhet_point_config.json';

// Global Datasets
const datasets = [];

// Global Map Options
const options = { readOnly: true, centerMap: true };

// Global Default Zoom
const defaultZoom = 6.480654760073648;

// Global Default Lat-Long
const defaultLatLong = { lat: 23.613341543209234, lng: 90.94863560966756 };

// Load Data to Map
export function loadDataToMap() {
    return (dispatch) => {
        // Fetch Data From API
        fetchAPIData()
            .then(results => {
                // Build Chittagong Data
                const ctgPointDataId = 'ctg_point_data';
                const ctgPointDataInfo = { id: ctgPointDataId, label: 'Places in Chittagong' };
                const ctgPointData = processRowObject(results.ctgData);
                const ctgPointDataset = { info: ctgPointDataInfo, data: ctgPointData };

                // Build Sylhet Data
                const sylhetPointDataId = 'sylhet_point_data';
                const sylhetPointDataInfo = { id: sylhetPointDataId, label: 'Places in Sylhet' };
                const sylhetPointData = processRowObject(results.sylhetData);
                const sylhetPointDataset = { info: sylhetPointDataInfo, data: sylhetPointData };

                // Construct Global Dataset
                datasets.push(ctgPointDataset);
                datasets.push(sylhetPointDataset);

                return datasets;
            })
            .then(datasets => {
                // Get Map Config
                let config = mapConfig;

                // Dispatch Add Data To Map Action
                dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

                // Dispatch update Map (for setting zoom and map position)
                dispatch( wrapTo('map', updateMap({
                    zoom: defaultZoom,
                    latitude: defaultLatLong.lat,
                    longitude: defaultLatLong.lng
                })) );
            })
            .then(() => {
                // Dispatch Data Loaded Action
                dispatch({ type: Types.SET_IS_DATA_LOADED_TRUE });
            })
            .catch(err => {
                console.error(err);
            });
    };
}

// Set Layer Visibility
export function setThisLayerVisibleOnly(dropdownValue) {
    return (dispatch, getState) => {
        // -1 because for Value 1(Chittagong) layer index is 0
        const layerIndex = dropdownValue-1;
        const layers = getState().keplerGl.map.visState.layers;

        // If dropdownValue = 0 which means 'All' selected
        if(layerIndex < 0) {
            for(let i = 0; i < layers.length; i++) {
                // Dispatch Layer Config Change action
                dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: true })) );
            } 
        } else {
            // Hide all layers except layerIndex
            for(let i = 0; i < layers.length; i++) {
                if(i === layerIndex) {
                    // Dispatch Layer Config Change action
                    dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: true })) );
                } else {
                    // Dispatch Layer Config Change action
                    dispatch( wrapTo('map', layerConfigChange(layers[i], { isVisible: false })) );
                }
            }
        }

        // Dispatch update Map (for setting zoom and map position)
        dispatch( wrapTo('map', updateMap({
            zoom: defaultZoom,
            latitude: defaultLatLong.lat,
            longitude: defaultLatLong.lng
        })) );
    }
}
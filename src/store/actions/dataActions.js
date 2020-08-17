import { wrapTo, addDataToMap, updateMap, layerConfigChange } from 'kepler.gl/actions';
import { processRowObject, processGeojson } from 'kepler.gl/processors';
import { setLayerVisibility, setFilterValue, fetchAPIData } from './actionsUtils';
import * as Types from './actionTypes';

////////////////////////
// Import Map Configs //
////////////////////////
import wardMapConfig from '../../configs/ward_point_polygon_config.json';
import wardFilteredConfig from '../../configs/ward_filtered_point_polygon_config.json';

// Global Datasets
const datasets = [];

// Map Options
const options = { readOnly: true, centerMap: true };

// Default Zoom
const defaultZoom = 12.759672619963176;

//////////////////////////////////////////
// Load Data To Map with Default Config //
//////////////////////////////////////////
export function loadDataToMap() {
    return (dispatch) => {
        // Fetch API Data
        fetchAPIData()
            .then(results => {
                // Build Polygon Dataset
                const polygonDataId = 'ward_area_data';
                const polygonDataInfo = { id: polygonDataId, label: 'Ward Area Polygon' };
                const polygonData = processGeojson(results.polygonData);
                const polygonDataset = { info: polygonDataInfo, data: polygonData };

                // Build Point Dataset
                const pointDataId = 'ward_point_data';
                const pointDataInfo = { id: pointDataId, label: 'Ward Point Data' }
                const pointData = processRowObject(results.pointData);
                const pointDataset = { info: pointDataInfo, data: pointData };

                // Build Datasets for Map
                datasets.push(polygonDataset);
                datasets.push(pointDataset);

                return datasets;
            })
            .then(datasets => {
                // Set Map Config
                const config = wardMapConfig;

                // Set Point Layer Visibility to false
                setLayerVisibility(config, 0, false);

                // Dispatch Add Data To Map Action
                dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

                // Dispatch update Map (for setting zoom to current zoom)
                dispatch( wrapTo('map', updateMap({ zoom: defaultZoom })) );
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

////////////////////////////
// Filter Data by Ward No //
////////////////////////////
export function filterDataByWardNo(wardNo, pointChecked, polygonChecked) {
    return (dispatch, getState) => {
        let config = {};
        if(wardNo !== 0) {
            config = wardFilteredConfig;
            setFilterValue(config, wardNo);
        } else {
            config = wardMapConfig;
        }

        // Get Current Zoom
        const currentZoom = getState().keplerGl.map.mapState.zoom;

        // Set Point Layer Visibility
        setLayerVisibility(config, 0, pointChecked);

        // Set Polygon Layer Visibility
        setLayerVisibility(config, 1, polygonChecked);

        //Add Data To Map
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom to current zoom)
        dispatch( wrapTo('map', updateMap({ zoom: currentZoom })) );
    }
}

/////////////////////////////
// Toggle Layer Visibility //
/////////////////////////////
export function toggleLayerVisibility(layerIndex, checked) {
    return (dispatch, getState) => {
        // Get Map Config
        const oldLayer = getState().keplerGl.map.visState.layers[layerIndex];

        // Set Layer Visibility
        dispatch( wrapTo('map', layerConfigChange(oldLayer, { isVisible: checked })) );
    }
}
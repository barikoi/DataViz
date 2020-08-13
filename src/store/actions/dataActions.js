import { wrapTo, addDataToMap, updateMap, layerConfigChange } from 'kepler.gl/actions';
import { processCsvData } from 'kepler.gl/processors';
import { setLayerVisibility, setFilterValue } from './actionsUtils';

//////////////////
// Import Data //
//////////////////
import polygonCsvWardData from '../../data/wards_area_data_6_to_8.csv.js';
import pointCsvWardData from '../../data/demo_places_data.csv.js';

////////////////////////
// Import Map Configs //
////////////////////////
import wardMapConfig from '../../configs/ward_point_polygon_config.json';
import wardFilteredConfig from '../../configs/ward_filtered_point_polygon_config.json';

////////////////////////
// Build POLYGON Data //
////////////////////////
const polygonDataId = 'ward_area_data';
const polygonDataInfo = { id: polygonDataId, label: 'Ward Area Data' }
const polygonData = processCsvData(polygonCsvWardData);
const polygonDataset = { info: polygonDataInfo, data: polygonData };

//////////////////////
// Build POINT Data //
//////////////////////
const pointDataId = 'ward_point_data';
const pointDataInfo = { id: pointDataId, label: 'Ward Point Data' }
const pointData = processCsvData(pointCsvWardData);
const pointDataset = { info: pointDataInfo, data: pointData };

// Build Datasets
const datasets = [ polygonDataset, pointDataset ];

// Map Options
const options = { readOnly: true, centerMap: true };

// Default Zoom
const defaultZoom = 12.759672619963176;

// ** DEBUG DATA ** //
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

pointDataset.data.fields.push({
    analyzerType: 'INT',
    format: '',
    name: 'ward_number',
    tableFieldIndex: 30,
    type: 'integer'
});
pointDataset.data.rows.forEach(row => {
    row.push(getRndInteger(6, 8));
});
let count6 = 0, count7 = 0, count8 = 0;
pointDataset.data.rows.forEach(row => {
    if(row[row.length-1] === 6) {
        count6++;
    } else if(row[row.length-1] === 7) {
        count7++;
    } else if(row[row.length-1] === 8) {
        count8++;
    }
});
// ** END DEBUG DATA ** //

//////////////////////////////////////////
// Load Data To Map with Default Config //
//////////////////////////////////////////
export function loadDataToMap() {
    return (dispatch) => {
        // Get Map Config
        const config = wardMapConfig;

        // Set Point Layer Visibility to false
        setLayerVisibility(config, 0, false);

        // Add Data To Map
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom)
        dispatch( wrapTo('map', updateMap({ zoom: defaultZoom })) );
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
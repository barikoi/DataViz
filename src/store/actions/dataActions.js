import { wrapTo, addDataToMap, updateMap } from 'kepler.gl/actions';
import { processCsvData } from 'kepler.gl/processors';

// Data Imports
import csvWardData from '../../data/wards_area_data_18_to_21.csv.js';
import wardAreaPolygonConfig from '../../configs/wardAreaPolygonConfig.json';
import ward_18_Filtered_Config from '../../configs/ward_18_Filtered_Config.json';
import ward_19_Filtered_Config from '../../configs/ward_19_Filtered_Config.json';
import ward_20_Filtered_Config from '../../configs/ward_20_Filtered_Config.json';
import ward_21_Filtered_Config from '../../configs/ward_21_Filtered_Config.json';

// Build Data
const dataId = 'ward_area_data';
const info = { id: dataId, label: 'Ward Area Data' }
const data = processCsvData(csvWardData);
const datasets = { info, data };
const options = { readOnly: true, centerMap: true };

export function loadDataToMap() {
    return (dispatch) => {
        // Get Config
        const config = wardAreaPolygonConfig;

        // Add Data To Map
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom)
        dispatch( wrapTo('map', updateMap({ zoom: 12.759672619963176 })) );
    };
}

export function filterDataByWardNo(wardNo) {
    return (dispatch) => {
        let config = {};
        switch(wardNo) {
            case 0:
                // Get Config
                config = wardAreaPolygonConfig;
                break;
            case 18:
                // Get Config
                config = ward_18_Filtered_Config;
                break;
            case 19:
                // Get Config
                config = ward_19_Filtered_Config;
                break;
            case 20:
                // Get Config
                config = ward_20_Filtered_Config;
                break;
            case 21:
                // Get Config
                config = ward_21_Filtered_Config;
                break;
            default: break;
        }

        // Add Data To Map
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom)
        dispatch( wrapTo('map', updateMap({ zoom: 12.759672619963176 })) );
    }
}
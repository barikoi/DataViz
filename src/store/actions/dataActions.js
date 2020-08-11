import { wrapTo, addDataToMap, updateMap } from 'kepler.gl/actions';
import { processCsvData } from 'kepler.gl/processors';
import { removeExistingFilters, setNewFilterWithConfig } from './actionUtils';

import wardsCsvData from '../../data/wards_area_data_18_to_21.csv.js';
import wardsAreaPolygonConfig from '../../configs/wardsAreaPolygonConfig.json';
import wardsAreaPolygonFilteredConfig from '../../configs/wardsAreaPolygonFilteredConfig.json';

const dataId = 'ward_area_data';

export function loadDataToMap() {
    return (dispatch, getState) => {
        // Build Data
        const info = { id: dataId, label: 'Ward Area Data' }
        const data = processCsvData(wardsCsvData);
        const datasets = { info, data };
        const options = { readOnly: true, centerMap: true };
        const config = wardsAreaPolygonConfig;

        // Dispatch update Dataset
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom)
        dispatch( wrapTo('map', updateMap({ zoom: 12.759672619963176 })) );

        //console.log(JSON.stringify(getState().keplerGl.map.visState.filters[0]));
    };
}

export function filterDataByWard(wardNo) {
    return (dispatch, getState) => {

        // Remove existing filters
        removeExistingFilters(dispatch, getState);

        // Set New Filter with configs
        setNewFilterWithConfig(dispatch, dataId, wardNo);

        console.log(getState());
    }
}
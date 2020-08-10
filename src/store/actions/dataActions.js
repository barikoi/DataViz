import { wrapTo, addDataToMap, updateMap } from 'kepler.gl/actions';
import { processCsvData } from 'kepler.gl/processors';

import wardsCsvData from '../../data/wards_area_data_18_to_21.csv.js';
import wardsAreaPolygonConfig from '../../configs/wardsAreaPolygonConfig.json';

export function loadDataToMap() {
    return (dispatch) => {
        // Build Data
        const dataId = 'ward_area_data';
        const info = { id: dataId, label: 'Ward Area Data' }
        const data = processCsvData(wardsCsvData);
        const datasets = { info, data };
        const options = { readOnly: true, centerMap: true };
        const config = wardsAreaPolygonConfig;

        // Dispatch update Dataset
        dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

        // Dispatch update Map (for setting zoom)
        dispatch( wrapTo('map', updateMap({ zoom: 12.759672619963176 })) );
    };
}
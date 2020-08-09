import { processCsvData } from 'kepler.gl/processors';
import { wrapTo, addDataToMap, updateMap, resetMapConfig } from 'kepler.gl/actions';
import { bindConfigToData } from './actionUtils.js';

import csvData from '../../data/new_places.csv.js';
import pointLayerConfig from '../../configs/pointLayerConfig.json';
import gridLayoutConfig from '../../configs/gridLayerConfig.json';

export function loadDataToMap(layerType) {
    return(dispatch) => {
        // Reset Map
        dispatch(
            wrapTo(
                'map',
                resetMapConfig()
            )
        );
        // Process CSV data and compose datasets
        const dataId = 'mirpur_places_data';
        const info = { id: dataId, label: 'Places Data' };
        const data = processCsvData(csvData);
        const datasets = { info, data };
        const options = { readOnly: false, centerMap: true };
        let config = {};

        if(layerType === 'point') {
            config = pointLayerConfig;
        } else if(layerType === 'grid') {
            config = gridLayoutConfig;
        }

        // Bind Config to DataId
        // bindConfigToData(config, dataId);
        
        // Dispatch AddDataToMap
        dispatch(
            wrapTo(
                'map',
                addDataToMap({
                    datasets,
                    options,
                    config
                })
            )
        );

        // Dispatch update Map (for setting zoom)
        dispatch(
            wrapTo(
                'map',
                updateMap({
                    zoom: 14.0
                })
            )
        );
    }
}
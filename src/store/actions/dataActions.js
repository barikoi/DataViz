import { wrapTo, addDataToMap, updateMap, setFilter } from 'kepler.gl/actions';
import { processRowObject } from 'kepler.gl/processors';
import { fetchDataFromAPI } from './actionUtils';
import * as ActionTypes from './actionTypes';

// Import initial Map Config
import initialMapConfig from '../../configs/birds_eye_vault_data_initial_config.json';

// Global Map Options
const options = { readOnly: true, centerMap: true };

// Global Default Zoom
const defaultZoom = 6.519345239926352;

// Global Default Lat-Long
const defaultLatLong = { lat: 23.86012585824617, lng: 88.54398598131883 };

export function loadDataToMap() {
    return (dispatch, getState) => {
        // Fetch data from API
        fetchDataFromAPI()
            .then(results => {
                // Build Birds Eye Dataset
                const birdsEyeDataId = 'birds_eye_point_data';
                const birdsEyeDataLabel = 'Bird\'s Eye Point Data';
                const birdsEyeDataInfo = { id: birdsEyeDataId, label: birdsEyeDataLabel };
                const birdsEyeData = processRowObject(results.birdsEyeData);
                const birdsEyeDataset = { info: birdsEyeDataInfo, data: birdsEyeData };

                // Build Vault Dataset
                const vaultDataId = 'vault_point_data';
                const vaultDataLabel = 'Vault Point Data';
                const vaultDataInfo = { id: vaultDataId, label: vaultDataLabel };
                const vaultData = processRowObject(results.vaultData);
                const vaultDataset = { info: vaultDataInfo, data: vaultData };

                // Build Map Datasets
                const datasets = [ birdsEyeDataset, vaultDataset ];

                return datasets;
            })
            .then(datasets => {
                // Get Map Config
                const config = initialMapConfig;

                // Dispatch Add Data To Map
                dispatch( wrapTo('map', addDataToMap({ datasets, options, config })) );

                // Set Default Map Zoom and Lat Long
                dispatch( wrapTo('map', updateMap({
                    zoom: defaultZoom,
                    latitude: defaultLatLong.lat,
                    longitude: defaultLatLong.lng
                })) );

                // Dispatch Data Loaded Complete Action
                dispatch({ type: ActionTypes.SET_IS_DATA_LOADED_TRUE });

                return datasets[0];
            })
            .then(data => {
                // Get All Time Filters excent Bird's Eyer enlarged to false. Kepler sets all enlarged to true by default
                let { filters } = getState().keplerGl.map.visState;

                for(let i = 0; i < filters.length; i++) {
                    if(filters[i].type === 'timeRange' && filters[i].dataId[0] !== data.info.id) {
                        dispatch( wrapTo('map', setFilter(i, 'enlarged', false, 0)) );
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
}
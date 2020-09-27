import { wrapTo, addDataToMap, updateMap, setFilter } from 'kepler.gl/actions';
import { processRowObject } from 'kepler.gl/processors';
import { fetchDataFromAPI } from './actionUtils';
import * as ActionTypes from './actionTypes';
import axios from 'axios';
import { toaster } from 'evergreen-ui';

// Import initial Map Config
import initialMapConfig from '../../configs/birds_eye_vault_data_initial_config.json';

// Global Map Options
const options = { readOnly: true, centerMap: true };

// Global Default Zoom
const defaultZoom = 6.519345239926352;

// Global Default Lat-Long
const defaultLatLong = { lat: 23.86012585824617, lng: 88.54398598131883 };

// API URLS
const UPDATE_BIRDS_EYE_PLACE_API = '/auth/place/update/'
const UPDATE_VAULT_PLACE_API = '/place/vault/'
const DELETE_BIRDS_EYE_PLACE_API = '/place/delete/'
const DELETE_VAULT_PLACE_API = '/delete/from/vault/'
const MOVE_TO_PLACES_API = '/move/to/places/'
const MOVE_TO_VAULT_API = '/move/to/vault/'
const RE_TOOL_TO_PLACES_API = '/test/auth/place/newplace/mapper'
const RE_TOOL_TO_VAULT_API = '/auth/place/newplace/mapper/vault'

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

////////////////////////////////
// Place Data CRUD Operations //
////////////////////////////////

// Update Place Data from Call-to-action Modal
export function updateBirdsEyePlace(place) {
    return () => {
        let { uCode } = place
        delete place.uCode

        if(place) {
            axios.post(UPDATE_BIRDS_EYE_PLACE_API + uCode, { ...place })
                .then(res => {
                    console.log('Successfully updated to Places!', res)
                    toaster.success('Successfully updated to Places!')
                })
                .catch(err => {
                    console.error(err)
                    toaster.danger('Error occured!')
                })
        }
    }
}

// Update Vault Place Data
export function updateVaultPlace(place) {
    return () => {
        let { uCode } = place
        delete place.uCode

        if(place) {
            axios.post(UPDATE_VAULT_PLACE_API + uCode + '/update', { ...place })
                .then(res => {
                    console.log('Successfully updated to Vault!', res)
                    toaster.success('Successfully updated to Vault!')
                })
                .catch(err => {
                    console.error(err)
                    toaster.danger('Error occured!')
                })
        }
    }
}

// Delete Birds Eye Place
export function deleteBirdsEyePlace(uCode) {
    return () => {
        axios.get(DELETE_BIRDS_EYE_PLACE_API + uCode)
            .then(res => {
                console.log('Successfully deleted from Places!', res)
                toaster.success('Successfully deleted from Places!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}

// Delete Vault Place
export function deleteVaultPlace(uCode) {
    return () => {
        axios.delete(DELETE_VAULT_PLACE_API + uCode)
            .then(res => {
                console.log('Successfully deleted from Vault!', res)
                toaster.success('Successfully deleted from Vault!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}

// Move place from Vault to Birds eye
export function moveToPlaces(uCode) {
    return () => {
        axios.get(MOVE_TO_PLACES_API + uCode)
            .then(res => {
                console.log('Successfully moved to Places!', res)
                toaster.success('Successfully moved to Places!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}

// Move place to Vault
export function movePlaceToVault(uCode, taskId=0) {
    return () => {
        axios.post(MOVE_TO_VAULT_API + uCode + '/' + taskId)
            .then(res => {
                console.log('Successfully moved to Vault!', res)
                toaster.success('Successfully moved to Vault!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}

// Re-Tool to Places
export function reToolToPlaces(place) {
    return () => {
        axios.post(RE_TOOL_TO_PLACES_API, { ...place })
            .then(res => {
                console.log('Successfully re-tooled to Places!', res)
                toaster.success('Successfully re-tooled to Places!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}

// Re-Tool to Vault
export function reToolToVault(place) {
    return () => {
        axios.post(RE_TOOL_TO_VAULT_API, { ...place })
            .then(res => {
                console.log('Successfully re-tooled to Vault!', res)
                toaster.success('Successfully re-tooled to Vault!')
            })
            .catch(err => {
                console.error(err)
                toaster.danger('Error occured!')
            })
    }
}
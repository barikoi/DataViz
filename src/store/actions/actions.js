import Processors from 'kepler.gl/processors';
import { wrapTo, addDataToMap } from 'kepler.gl/actions';
import * as Types from './types';

import { getMapConfig } from '../../configs/mapConfig';
import csvData from '../../data/demo.csv.js';

const info = { 
	id: 'demo_data',
	label: 'Demo Data' 
};

export function loadParkingData(mapMode) {
    return (dispatch) => {
		dispatch( requestParkingData() );

		dispatch( getParkingData() );

		const data = Processors.processCsvData(csvData);
		console.log(data);
		const config = getMapConfig(mapMode);
		const datasets = [{ info, data }]; 

		dispatch(
			wrapTo('map',
				addDataToMap({
					datasets,
					config
				})
			)
		);
    };
}

export function toggleMapMode(mode) {
	return (dispatch, getState) => {
    	
        const config = getMapConfig( mode );
        const datasets =  getDatasets(getState());

        dispatch(
		   	wrapTo('map',
				addDataToMap({
					datasets,
					config
				})
			)); 

        dispatch( setMapMode(mode) );
    };
}

function setMapMode(mapMode) {
	return {
        type: Types.SET_MAP_MODE,
        mapMode
    };
}

function requestParkingData() {
	return {
        type: Types.REQUEST_PARKING_DATA
    };
}

function getParkingData() {
	return {
        type: Types.GET_PARKING_DATA
    };
}

function getDatasets({ keplerGl }) {
	
	const map = keplerGl.map;
	if (!map || !map.visState) {
		return [];
	}

	const { demo_data } = map.visState.datasets;
	return [{
		info,
		data: {
			fields: demo_data.fields,
			rows: demo_data.allData
		}
	}];
}
import * as Types from '../actions/types';

const isLoadingReducer = function ( state = false, action) {
	switch (action.type) {
		case Types.REQUEST_PARKING_DATA:
			return true;
		case Types.GET_PARKING_DATA:
			return false;
		default: 
			return state;
	}
};

export default isLoadingReducer;
import * as Types from '../actions/types';
import { MAP_MODE } from '../../configs/mapConfig';

const mapModeReducer = function ( state = MAP_MODE.POINTS, action ) {
	if (action.type === Types.SET_MAP_MODE) {
		return action.mapMode;
	}
	return state;
};

export default mapModeReducer;
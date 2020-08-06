import { combineReducers } from 'redux';
import mapModeReducer from './mapModeReducer';
import isLoadingReducer from './isLoadingReducer';

const appReducer = combineReducers({
	mapMode: mapModeReducer,
	isLoading: isLoadingReducer
});

export default appReducer;
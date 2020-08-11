import { wrapTo, removeFilter, addFilter, setFilter, setFilterPlot } from 'kepler.gl/actions';

import filterPropConfig from '../../configs/demoFilterConfig.json';

export function removeExistingFilters(dispatch, getState) {
    let { filters } = getState().keplerGl.map.visState;
    for(let i = 0; i < filters.length; i++) {
        dispatch( wrapTo('map', removeFilter(0)) );
    }
}

export function setNewFilterWithConfig(dispatch, dataId, wardNo) {
    // Add Filter
    dispatch( wrapTo('map', addFilter(dataId)) );

    // // Set Filter Plot
    const filterProp = filterPropConfig

    dispatch( wrapTo('map', setFilterPlot(0, filterProp)) );
}
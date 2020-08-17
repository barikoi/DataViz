import axios from 'axios';

// Pre-defined Polygon Layer Colors
const polygonLayerColors = [ "#5A1846", "#831A3D", "#E3611C", "#FFC300" ];
const lowestWardNo = 18;

// Data API
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const POLYGON_API_URL = '/wards';
const POINT_API_URL = '/wards/places';

// Fetch API Data
export function fetchAPIData() {
    // Set Axios Base API Url
    axios.defaults.baseURL = BASE_API_URL;

    return axios.all([
        axios.get(POLYGON_API_URL),
        axios.get(POINT_API_URL)
    ])
    .then(axios.spread((result1, result2) => {
        return {
            polygonData: result1.data.data,
            pointData: result2.data.data
        };
    }))
    .catch(err => {
        console.error(err);
    });
}

// 'dispatch' and 'getState' are passed from action
export function setLayerVisibility(config, layerIndex, visibility) {
    const layerObj = config.config.visState.layers[layerIndex];
    layerObj.config.isVisible = visibility;
}

// Bind filtered wardNo to Config Value
export function setFilterValue(config, wardNo) {
    const filters = config.config.visState.filters;
    const polygonLayer = config.config.visState.layers[1];

    // Set Filter Value Range
    filters.forEach(filter => {
        filter.value = [ wardNo, wardNo ];
    });

    // Set Filtered Polygon Layer Color
    polygonLayer.config.visConfig.colorRange.colors = [ polygonLayerColors[wardNo-lowestWardNo] ];
}
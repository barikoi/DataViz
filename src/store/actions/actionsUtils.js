// Pre-defined Polygon Layer Colors
const polygonLayerColors = [ "#5A1846", "#E3611C", "#FFC300" ];
const lowestWardNo = 6;

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
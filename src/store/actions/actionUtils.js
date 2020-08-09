export function bindConfigToData(config, dataId) {
    let { filters, layers, interactionConfig } = config.config.visState;

    // If Filter Exists
    if(filters.length > 0) {
        filters.forEach(filterObj => {
            let newKey = filterObj['dataId'];
            delete filterObj['dataId'];
            filterObj[dataId] = newKey;
        })
    }

    // If Layer Exists
    if(layers.length > 0) {
        layers.forEach(layerObj => {
            layerObj.config.dataId = dataId;
        })
    }

    // If Tooltip turned on
    if(interactionConfig.tooltip) {
        let newKey = interactionConfig.tooltip.fieldsToShow['dataId'];
        delete interactionConfig.tooltip.fieldsToShow['dataId'];
        interactionConfig.tooltip.fieldsToShow[dataId] = newKey;
    }
}
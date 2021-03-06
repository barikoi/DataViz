import pointSettings from './pointLayerConfig';
import gridSettings from './gridLayerConfig';

export const MAP_MODE = {
    POINTS: "POINTS",
    GRID: "GRID"
};

function getModeSettings(mode) {
    switch(mode) {
        case MAP_MODE.POINTS:
            return pointSettings;
        case MAP_MODE.GRID:
            return gridSettings;
        default:
            return pointSettings;
    }
};

const mapStyle = {
    styleType: "dark",
    topLayerGroups: {},
    visibleLayerGroups: {
        "label": true,
        "road": true,
        "border": false,
        "building": true,
        "water": true,
        "land": true
    }
};

const interactionConfig = {
	tooltip: {
        fieldsToShow: {
            "demo_data": [
                "place_name",
                "pType",
                "Address",
                "latitude",
                "longitude",
                "created_at"
            ]
        },
        enabled: true
    },
    brush: {
        enabled: false
    }
};

export function getMapConfig(mode) {
  
    const settings = getModeSettings(mode);

    return {
        version: "v1",
        config: {
        visState: {
            filters: [],
            layers: [ settings.config ],
            interactionConfig,
            layerBlending: "normal",
            splitMaps: []
        },
        mapState: settings.mapState,
        mapStyle
        }
    };
};
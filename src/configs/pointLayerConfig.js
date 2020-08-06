const visualChannels = {
    colorField: {
        "name": "pType",
        "type": "string"
    },
    colorScale: "quantize",
    // sizeField: {
    //        "name": "created_at",
    //        "type": "string"
    // },
    // sizeScale: "sqrt"
};

const pointConfig = {
    radius: 10,
    fixedRadius: false,
    opacity: 0.7,
    outline: false,
    colorRange: {
        colors: [
              "#00939C",
              "#5DBABF",
              "#BAE1E2",
              "#F8C0AA",
              "#DD7755",
              "#C22E00"
        ],
        reversed: false
    },
    radiusRange: [ 0, 20 ],
    "hi-precision": false
};

const layerConfig = {
    dataId: "demo_data",
    label: "Demo Places",
    columns: {
          "lat": "latitude",
          "lng": "longitude",
          "altitude": null
    },
    isVisible: true,
    visConfig: pointConfig
};

const config = {
    id: "point_layer",
    type: "point",
    config: layerConfig,
    visualChannels
};

const mapState = {
    "bearing": 0,
    "dragRotate": false,
    "latitude": 55.7558,
    "longitude": 37.5915,
    "pitch": 0,
    "zoom": 12,
    "isSplit": false
};

export default { config, mapState };
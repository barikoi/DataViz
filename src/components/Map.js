import React from 'react';
import KeplerGl from 'kepler.gl';
import { connect } from 'react-redux';
import axios from 'axios';
import { addDataToMap } from 'kepler.gl/actions';
import { processRowObject } from 'kepler.gl/processors';
import { togglePerspective } from 'kepler.gl/actions';
import KeplerGlSchema from 'kepler.gl/schemas';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class Map extends React.Component {
    componentDidMount() {
        const API_URL = "https://admin.barikoi.xyz:8090/search/autocomplete/web?search=barikoi";
        axios.get(API_URL)
            .then(results => {
                let { places } = results.data;

                const config = {
                    uiState: {
                        readOnly: true,
                        currentModal: null
                    }
                }

                this.props.dispatch(addDataToMap({
                    datasets: {
                      info: {label: 'Places', id: 'places_data'},
                      data: processRowObject(places)
                    },
                    options: {
                        centerMap: true,
                        readOnly: true
                    },
                    config: config
                }));

                //this.props.dispatch(togglePerspective());
            })
            .then(() => {
                // Get config
                const configToSave = KeplerGlSchema.getConfigToSave(this.props.keplerGl.rootMap);
                console.log("Map Config: ", configToSave.config.visState.layers[0].config.visConfig.radius);
            })
    }

    render() {
        let { mapDimension } = this.props

        return (
            <KeplerGl
                id='rootMap'
                mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                width={ mapDimension.mapWidth }
                height={ mapDimension.mapHeight }
            />
        )
    }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(Map);
import React from 'react';
import KeplerGl from './KeplerGl';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class Map extends React.Component {
    render() {
        let { mapWidth, mapHeight } = this.props.mapDimension

        return (
            <KeplerGl
                id='map'
                mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                width={ mapWidth }
                height={ mapHeight }
                mint={ false }
            />
        )
    }
}

export default Map;
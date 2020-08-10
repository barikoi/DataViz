import React from 'react';

import KeplerGl from './KeplerGl';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    render() {
        let { width, height } = this.props;

        return (
            <div className='map-container'>
                <KeplerGl
                    id='map'
                    mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                    width={ width }
                    height={ height }
                />
            </div>
        );
    }
}

export default KeplerGlMap;
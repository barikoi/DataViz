import React from 'react';
import { connect } from 'react-redux';
import { loadDataToMap } from '../store/actions/dataActions';

import KeplerGl from './KeplerGl';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    componentDidMount() {
        this.props.dispatch(loadDataToMap());
    }

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

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(KeplerGlMap);
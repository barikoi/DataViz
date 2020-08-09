import React from 'react';
import KeplerGl from './KeplerGl';
import { connect } from 'react-redux';
import { loadDataToMap } from '../store/actions/dataActions.js';

import InfoPanel from './InfoPanel';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerMap extends React.Component {
    state = {
        isLoading: false,
        layerType: 'point'
    }

    setLayerType = newLayerType => {
        this.setState({
            layerType: newLayerType
        })

        // Call Load Data Action
        this.props.dispatch(loadDataToMap(newLayerType));
    }

    componentDidMount() {
        let { layerType } = this.state;

        // Call Load Data Action
        this.props.dispatch(loadDataToMap(layerType));
    }

    render() {
        let { width, height } = this.props;
        let { isLoading, layerType } = this.state;

        return (
            <div className='map-container'>
                <InfoPanel isLoading={ isLoading } layerType={ layerType } setLayerType={ this.setLayerType } />
                <KeplerGl
                    id='map'
                    mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                    width={ width }
                    height={ height }
                />
            </div>
        );
    };
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({ dispatch, loadDataToMap })

export default connect(mapStateToProps, mapDispatchToProps)(KeplerMap);
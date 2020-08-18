import React from 'react';
import { connect } from 'react-redux';
import { loadDataToMap, setThisLayerVisibleOnly } from '../store/actions/dataActions';

import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    state = {
        dropdownValue: 0
    }

    componentDidMount() {
        this.props.dispatch(loadDataToMap());
    }

    componentDidUpdate(prevProps, prevState) {
        let { dropdownValue } = this.state;
        if(prevState.dropdownValue !== dropdownValue) {
            // Dispatch Set Layer Visibility.
            this.props.dispatch(setThisLayerVisibleOnly(dropdownValue));
        }
    }

    setDropdownValue = (value) => {
        this.setState({
            dropdownValue: value
        });
    }

    render() {
        let { width, height } = this.props;
        let { isDataLoaded } = this.props.app;

        return (
            <div className='map-container' style={{ overflow: 'hidden' }}>
                <KeplerSidePanel
                    isDataLoaded={ isDataLoaded }
                    setDropdownValue={ this.setDropdownValue }
                />
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
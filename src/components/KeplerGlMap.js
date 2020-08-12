import React from 'react';
import { connect } from 'react-redux';
import { loadDataToMap, filterDataByWardNo } from '../store/actions/dataActions';

// Customized kepler.gl Component
import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    state = {
        wardNo: 0
    }

    componentDidMount() {
        // Initial Data Load
        this.props.dispatch(loadDataToMap());
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.wardNo !== prevState.wardNo) {
            // Filter Data by wardNo
            this.props.dispatch(filterDataByWardNo(this.state.wardNo));
        }
    }

    displayFilteredByWardNo = wardNo => {
        this.setState({
            wardNo
        });
    }

    render() {
        let { width, height } = this.props;

        return (
            <div className='map-container'>
                <KeplerSidePanel displayFilteredByWardNo={ this.displayFilteredByWardNo } />
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
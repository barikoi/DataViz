import React from 'react';
import { connect } from 'react-redux';
import { loadDataToMap, filterDataByWard } from '../store/actions/dataActions';

import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    state = {
        wardNo: 0
    }

    componentDidMount() {
        this.props.dispatch(loadDataToMap(this.state.wardNo));
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.wardNo !== prevState.wardNo) {
            // Filter Data by wardNo
            this.props.dispatch(filterDataByWard(this.state.wardNo));
        }
    }

    displaySingleWard = wardNo => {
        this.setState({
            wardNo
        });
    }

    render() {
        let { width, height } = this.props;
        console.log('Re-rendered');

        return (
            <div className='map-container'>
                <KeplerSidePanel displaySingleWard={ this.displaySingleWard } />
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
import React from 'react';
import { connect } from 'react-redux';
import { loadDataToMap, filterDataByWardNo, toggleLayerVisibility } from '../store/actions/dataActions';

// Customized kepler.gl Component
import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    state = {
        wardNo: 0,
        pointChecked: false,
        polygonChecked: true
    }

    componentDidMount() {
        // Initial Data Load
        this.props.dispatch(loadDataToMap());
    }

    componentDidUpdate(prevProps, prevState) {
        let { wardNo, pointChecked, polygonChecked } = this.state;
        if(wardNo !== prevState.wardNo) {
            // Filter Data by wardNo And set to current layer visibility
            this.props.dispatch(filterDataByWardNo(wardNo, pointChecked, polygonChecked));
        }
        if(pointChecked !== prevState.pointChecked) {
            // Toggle Point Layer Visibility
            this.props.dispatch(toggleLayerVisibility(0, pointChecked));
        }
        if(polygonChecked !== prevState.polygonChecked) {
            // Toggle Polygon Layer Visibility
            this.props.dispatch(toggleLayerVisibility(1, polygonChecked));
        }
    }

    setWardNo = wardNo => {
        this.setState({
            wardNo
        });
    }



    handleCheckboxChange = (checkboxName) => {
        this.setState({
            [checkboxName]: !this.state[checkboxName]
        });
    }

    render() {
        let { width, height } = this.props;
        let { pointChecked, polygonChecked } = this.state;

        return (
            <div className='map-container'>
                <KeplerSidePanel
                    setWardNo={ this.setWardNo }
                    handleCheckboxChange={ this.handleCheckboxChange }
                    pointChecked={ pointChecked }
                    polygonChecked={ polygonChecked }
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
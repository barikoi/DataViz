import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { throttle } from 'lodash'

import InfoPanel from './components/InfoPanel';
import Map from './components/Map';

import { loadParkingData, toggleMapMode } from './store/actions/actions';

class App extends React.Component {
  state = {
    mapWidth: window.innerWidth,
    mapHeight: window.innerHeight
  }

  updateSize = () => {
		this.setState({
	      mapWidth: window.innerWidth,
	      mapHeight: window.innerHeight
	    });
  }
  
  toggleMapMode = ({ target }) => {
		const { mode } = target.dataset;
		this.props.dispatch( toggleMapMode(mode) );
  }
  
  shouldComponentUpdate(nextProps, nextState) {
		const { mapWidth, mapHeight } = this.state;
		const  { mapMode, isLoading } = this.props.app;

		return (mapMode !== nextProps.app.mapMode) ||
			(isLoading !== nextProps.app.isLoading) ||
			Math.abs(mapWidth - nextState.mapWidth) > 0.5 ||
    	Math.abs(mapHeight - nextState.mapHeight) > 0.5;
	}

  componentDidMount() {
    this.props.dispatch(loadParkingData());
    this.onResize = throttle(this.updateSize, 150, { trailing: true });
		window.addEventListener('resize', this.onResize);
  }

  render() {
    let { mapWidth, mapHeight } = this.state;
    const  { mapMode, isLoading } = this.props.app;

    return (
      <div className="App">
        <InfoPanel
          mode={ mapMode }
					isLoading= { isLoading }
					onToggle={ this.toggleMapMode }
        />
        <Map mapDimension={{ mapWidth, mapHeight }} />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(App);

import React from 'react';
import './App.css';

import Map from './components/Map';

class App extends React.Component {
  mapDimension = {
    mapWidth: window.innerWidth,
    mapHeight: window.innerHeight
  }

  render() {
    return (
      <div className="App">
        <Map mapDimension={ this.mapDimension } />
      </div>
    );
  }
}

export default App;

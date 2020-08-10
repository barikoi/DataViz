import React from 'react';
import { throttle } from 'lodash';

import KeplerGlMap from './components/KeplerGlMap';

class App extends React.Component {
  state = {
    mapWidth: window.innerWidth,
    mapHeight: window.innerHeight
  }

  updateAppSize = () => {
    this.setState({
      mapWidth: window.innerWidth,
      mapHeight: window.innerHeight
    })
  }

  componentDidMount() {
    this.onResize = throttle(this.updateAppSize, 0, { trailing: true });
    window.addEventListener('resize', this.onResize);
  }

  render() {
    let { mapWidth, mapHeight } = this.state;

    return (
      <div className="App">
        <KeplerGlMap width={ mapWidth } height={ mapHeight } />
      </div>
    );
  }
}

export default App;

import React from 'react';
import './App.css';
import { throttle } from 'lodash';

import KeplerMap from './components/KeplerMap.js';

class App extends React.Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  updateAppSize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  componentDidMount() {
    this.onResize = throttle(this.updateAppSize, 0, { trailing: true });
		window.addEventListener('resize', this.onResize);
  }

  render() {
    let { width, height } = this.state;

    return (
      <div className="app">
        <KeplerMap width={ width } height={ height } />
      </div>
    );
  }
}

export default App;
import React from 'react';

import SidePanelHeader from './SidePanelHeader';
import SidePanelBody from './SidePanelBody';
import SidePanelFooter from './SidePanelFooter';

import './css/SidePanelStyles.css';

class KeplerSidePanel extends React.Component {
    state = {
        isVisible: true
    }

    toggleSidePanelView = e => {
        e.preventDefault();

        let { isVisible } = this.state;
        this.setState({
            isVisible: !isVisible
        });
    }

    render() {
        let { isVisible } = this.state;
        let { displayFilteredByWardNo } = this.props;

        return (
            <div className={ isVisible ? 'side-panel-container' : 'side-panel-container hidden' }>
                <div className='side-panel'>
                    <SidePanelHeader />
                    <SidePanelBody displayFilteredByWardNo={ displayFilteredByWardNo } />
                    <SidePanelFooter />
                </div>
                <div className='toggle-view-btn'>
                    <button onClick={ this.toggleSidePanelView }>{ isVisible ? 'Hide' : 'Show' }</button>
                </div>
            </div>
        );
    }
}

export default KeplerSidePanel;
import React from 'react';
import './infoPanelStyles.css';

import Header from './Header';
import Footer from './Footer';



class InfoPanel extends React.Component {
	state = {
		activeBtnId: 'point-btn'
	}

	handleLayerSelect = e => {
		e.preventDefault();

		if(e.target.id === 'point-btn') {
			this.props.setLayerType('point');
		} else if(e.target.id === 'grid-btn') {
			this.props.setLayerType('grid');
		}

		this.setState({
			activeBtnId: e.target.id
		})
	}

	render() {
		let { isLoading } = this.props;
		let { activeBtnId } = this.state;

		return (
			<div className="info-panel">
				<Header />
				{
					isLoading ? 
					( <main>
							<div className="preloader"></div> 
						</main> 
					) :
					( <main>
							<p>Switch between layer modes</p>
							<div className="buttons">
								<button
									id='point-btn'
									className={ activeBtnId==='point-btn' ? 'active' : '' }
									onClick={ e => this.handleLayerSelect(e) }>
									Points
								</button>
								<button
									id='grid-btn'
									className={ activeBtnId==='grid-btn' ? 'active' : '' }
									onClick={ e => this.handleLayerSelect(e) }>
									Aggregated Grid
								</button>
							</div>
						</main> )
				}
				<Footer />
			</div>
		);
	}
};

export default InfoPanel;
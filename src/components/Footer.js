import React from 'react';

class Footer extends React.Component {
	render() {
		return (
			<footer>
				<p>
					Powered by | <a href="https://uber.github.io/kepler.gl/">Kepler.Gl</a>
				</p>
				<p>
					Maps | <a href="https://www.mapbox.com/about/maps/">© Mapbox </a>
					<a href="https://www.openstreetmap.org/about/">© OpenStreetMap</a>
				</p>
			</footer>
		);
	}
}

export default Footer;
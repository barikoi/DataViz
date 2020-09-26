import React from 'react'
import PropTypes from 'prop-types'
import { latLongValidator } from '../../validators/latLongValidator'

// Import Components
import { Pane } from 'evergreen-ui'
import ModalSetLatLongForm from './ModalSetLatLongForm'
import ReactMapGl, { FullscreenControl, ScaleControl, GeolocateControl, Marker } from 'react-map-gl'
import ModalMapMarkerPin from './ModalMapMarkerPin'

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN

class ModalMapPanel extends React.PureComponent {
    state = {
        viewport: {
            width: 300,
            height: 622,
            latitude: 23.7276491,
            longitude: 90.4083781,
            zoom: 12
        },
        markerCoordinates: null,
        error: {}
    }

    componentDidMount() {
        const { latitude, longitude } = this.props
        const { viewport } = this.state
        if(latitude && longitude) {
            this.setState({
                viewport: { ...viewport, latitude, longitude },
                markerCoordinates: { latitude, longitude }
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { latitude, longitude } = this.props
        const { viewport } = this.state

        // If Lat-Long Changes in Props
        if(prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
            this.setState({
                viewport: { ...viewport, latitude, longitude },
                markerCoordinates: { latitude, longitude }
            })
        }
    }

    // If Map Viewport is Changed or Resized
    handleMapViewportChange = viewport => {
        this.setState({ viewport })
    }

    // When Clicked on Map
    handleMapClick = data => {
        const latitude = data.lngLat[1]
        const longitude = data.lngLat[0]

        // Validity Checks for Latitude and Longitude
        const { error } = this.state
        latLongValidator(latitude, longitude)
            .then(res => {
                if(!res.error.message) {
                    this.props.setModalPlaceData(res.data)

                    if(error.message) {
                        this.setError(res.error)
                    }
                    
                } else {
                    this.setError(res.error)
                }
            })
            .catch(err => console.error(err))
    }

    setError = error => {
        this.setState({ error })
    }

    render() {
        const { setModalPlaceData } = this.props
        const { viewport, markerCoordinates, error } = this.state

        return (
            <Pane
                background='tint1'
                elevation={ 2 }
                border='muted'
                display='flex'
                flexDirection='column'
                justifyContent='flex-start'
                alignItems='center'
                padding={ 10 }
                marginRight={ 10 }
            >
                <ModalSetLatLongForm
                    latLong={ markerCoordinates ? markerCoordinates.latitude + ', ' + markerCoordinates.longitude : '' }
                    setModalPlaceData={ setModalPlaceData }
                    error={ error }
                    setError={ this.setError }
                />

                <ReactMapGl
                    { ...viewport }
                    onViewportChange={ this.handleMapViewportChange }
                    mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                    onClick={ this.handleMapClick }
                    mapStyle='https://map.barikoi.com/styles/osm-liberty/style.json'
                >
                    <div style={ geolocateStyle }>
                        <GeolocateControl />
                    </div>
                    <div style={ fullscreenControlStyle }>
                        <FullscreenControl />
                    </div>
                    <div style={ scaleControlStyle }>
                        <ScaleControl />
                    </div>

                    { markerCoordinates &&
                        <Marker latitude={ markerCoordinates.latitude } longitude={ markerCoordinates.longitude }>
                            <ModalMapMarkerPin />
                        </Marker>
                    }
                </ReactMapGl>
            </Pane>
        )
    }
}

const geolocateStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
}

const fullscreenControlStyle = {
    position: 'absolute',
    top: 36,
    left: 0,
    padding: '10px'
}

const scaleControlStyle = {
    position: 'absolute',
    bottom: 36,
    left: 0,
    padding: '10px'
}

ModalMapPanel.propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    setModalPlaceData: PropTypes.func.isRequired
}

export default ModalMapPanel
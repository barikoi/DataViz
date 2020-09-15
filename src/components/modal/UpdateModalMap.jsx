import React from 'react'
import PropTypes from 'prop-types'

import ReactMapGl, { FullscreenControl, ScaleControl, GeolocateControl, Marker } from 'react-map-gl'
import MapMarkerPin from './MapMarkerPin'

import './css/UpdateModalMapStyles.css'

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class UpdateModalMap extends React.PureComponent {
    state ={
        latLong: '',
        viewport: {
            width: 400,
            height: 400,
            latitude: 23.7577,
            longitude: 90.4376,
            zoom: 12
        }
    }

    componentDidMount() {
        const { latitude, longitude } = this.props.markerCoordinates
        this.setState({ viewport: { ...this.state.viewport, latitude, longitude } })
    }

    componentDidUpdate(prevProps, prevState) {
        const { latitude, longitude } = this.props.markerCoordinates

        // If Lat-Long Changed on props
        if(prevProps.markerCoordinates.latitude !== latitude || prevProps.markerCoordinates.longitude !== longitude) {
            this.setState({
                latLong: latitude + ', ' + longitude,
                viewport: { ...this.state.viewport, latitude, longitude }
            })
        }
    }

    handleOnChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleOnSubmit = event => {
        event.preventDefault()
        const latLong = this.state.latLong.split(', ')
        const latitude = parseFloat(latLong[0])
        const longitude = parseFloat(latLong[1])
        this.props.handleMapFormSubmit({ latitude, longitude })
    }

    handleMapViewportChange = viewport => {
        this.setState({ viewport })
    }

    handleOnMapClick = clickedInfo => {
        const { lngLat } = clickedInfo
        this.setState({ latLong: lngLat[1]+', '+lngLat[0] })
        this.props.handleMapFormSubmit({ latitude: lngLat[1], longitude: lngLat[0] })
    }

    render() {
        const { latLong, viewport } = this.state
        const { markerCoordinates } = this.props

        return (
            <div className='modal-map-container'>
                <div className='modal-map-set-long-lat'>
                    <form className='set-long-lat-form' onSubmit={ this.handleOnSubmit }>
                        <input type='text' id='map-set-long-lat' name='latLong' placeholder='Lat, Long...' value={ latLong } onChange={ this.handleOnChange } required={ true } />
                        <button type='submit'>Set</button>
                    </form>
                </div>
                
                <div className='modal-map'>
                    <ReactMapGl
                        { ...viewport }
                        width='100%'
                        height='100%'
                        onViewportChange={ this.handleMapViewportChange }
                        mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                        onClick={ this.handleOnMapClick }
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

                        <Marker latitude={ markerCoordinates.latitude } longitude={ markerCoordinates.longitude }>
                            <MapMarkerPin />
                        </Marker>
                    </ReactMapGl>
                </div>
            </div>
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

UpdateModalMap.propTypes = {
    handleMapFormSubmit: PropTypes.func.isRequired
}

export default UpdateModalMap
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
            zoom: 8
        },
        markerCoordinates: {
            lat: 23.7577,
            long: 90.4376
        }
    }

    componentDidMount() {
        const { markerCoordinates } = this.props
        this.setState({ markerCoordinates, viewport: { latitude: markerCoordinates.lat, longitude: markerCoordinates.long } })
        this.props.handleMapFormSubmit(this.state.markerCoordinates)
    }

    componentDidUpdate(prevProps, prevState) {
        const { markerCoordinates } = this.state
        if(prevState.markerCoordinates.lat !== markerCoordinates.lat) {
            this.props.handleMapFormSubmit(this.state.markerCoordinates)
        }

        if(prevState.markerCoordinates.long !== markerCoordinates.long) {
            this.props.handleMapFormSubmit(this.state.markerCoordinates)
        }
    }

    handleOnChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleOnSubmit = event => {
        event.preventDefault()
        const latLong = this.state.latLong.split(', ')
        const lat = parseFloat(latLong[0])
        const long = parseFloat(latLong[1])
        this.setState({
            markerCoordinates: { lat, long },
            viewport: { latitude: lat, longitude: long }
        })
    }

    handleMapViewportChange = viewport => {
        this.setState({ viewport })
    }

    handleOnMapClick = clickedInfo => {
        const { lngLat } = clickedInfo
        this.setState({
            latLong: lngLat[1]+', '+lngLat[0],
            markerCoordinates: { lat: lngLat[1], long: lngLat[0] }
        })
    }

    render() {
        return (
            <div className='modal-map-container'>
                <div className='modal-map-set-long-lat'>
                    <form className='set-long-lat-form' onSubmit={ this.handleOnSubmit }>
                        <input type='text' id='map-set-long-lat' name='latLong' placeholder='Lat, Long...' value={ this.state.latLong } onChange={ this.handleOnChange } required={ true } />
                        <button type='submit'>Set</button>
                    </form>
                </div>
                
                <div className='modal-map'>
                    <ReactMapGl
                        {...this.state.viewport}
                        width='100%'
                        height='100%'
                        onViewportChange={ this.handleMapViewportChange }
                        mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                        onClick={ this.handleOnMapClick }
                    >
                        <div style={geolocateStyle}>
                            <GeolocateControl />
                        </div>
                        <div style={fullscreenControlStyle}>
                            <FullscreenControl />
                        </div>
                        <div style={scaleControlStyle}>
                            <ScaleControl />
                        </div>

                        <Marker latitude={ this.state.markerCoordinates.lat } longitude={ this.state.markerCoordinates.long }>
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
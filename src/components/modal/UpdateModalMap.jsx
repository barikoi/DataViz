import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import ReactMapGl, { FullscreenControl, ScaleControl, GeolocateControl, Marker } from 'react-map-gl'
import MapMarkerPin from './MapMarkerPin'

import './css/UpdateModalMapStyles.css'

const REVERSE_GEO_API_URL = '/reverse/without/auth'

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
        },
        error: {}
    }

    componentDidMount() {
        const { latitude, longitude } = this.props.markerCoordinates
        this.setState({ viewport: { ...this.state.viewport, latitude, longitude } })
    }

    componentDidUpdate(prevProps) {
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

        // Check Lat-Long Validity
        this.latLongValidityResponse(latitude, longitude)
            .then(res => {
                if(!res.error.message) {
                    this.props.handleMapFormSubmit(res.data)

                    if(this.state.error.message) {
                        this.setState({ error: res.error })
                    }
                    
                } else {
                    this.setState({ error: res.error })
                }
            })
            .catch(err => console.error(err))
    }

    handleMapViewportChange = viewport => {
        this.setState({ viewport })
    }

    handleOnMapClick = clickedInfo => {
        const latitude = clickedInfo.lngLat[1]
        const longitude = clickedInfo.lngLat[0]

        // Check Lat-Long Validity
        this.latLongValidityResponse(latitude, longitude)
            .then(res => {
                if(!res.error.message) {
                    this.props.handleMapFormSubmit(res.data)

                    if(this.state.error.message) {
                        this.setState({ error: res.error })
                    }
                    
                } else {
                    this.setState({ error: res.error })
                }
            })
            .catch(err => console.error(err))
    }

    latLongValidityResponse = (latitude, longitude) => {
        // Check Lat-Long Validity
        return new Promise(resolve => {
            let error = {}
            if(latitude > 90 || latitude < -90) {
                error.message = 'Latitude must be between -90 and 90'
            }
            
            if(longitude > 180 || longitude < -180) {
                error.message = 'Longitude must be between -180 and 180'
            }
            
            resolve({ error })

        })
        .then(res => {
            if(res.error.message) {
                return res

            } else {
                return axios.get(REVERSE_GEO_API_URL, { params: { latitude, longitude } })
                    .then(results => {
                        if(!results.data[0]) {
                            res.error = results.data

                        } else {
                            res.data = results.data[0]
                        }

                        return res

                    })
                    .catch(err => { throw(err) })
            }
        })
        .catch(err => { throw(err) })
    }

    render() {
        const { latLong, viewport, error } = this.state
        const { markerCoordinates } = this.props

        return (
            <div className='modal-map-container'>
                <div className='modal-map-set-long-lat'>
                    <form className='set-long-lat-form' onSubmit={ this.handleOnSubmit }>
                        <input type='text' id='map-set-long-lat' name='latLong' placeholder='Lat, Long...' value={ latLong } onChange={ this.handleOnChange } required={ true } />
                        <button type='submit'>Set</button>
                    </form>
                    { error.message &&
                        <p className='input-error'>{ error.message }</p>
                    }
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
    markerCoordinates: PropTypes.object,
    handleMapFormSubmit: PropTypes.func.isRequired,
}

export default UpdateModalMap
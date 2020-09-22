import React from 'react'
import PropTypes from 'prop-types'
import { latLongValidator } from '../../validators/latLongValidator'

// Import Components
import { TextInputField, Button } from 'evergreen-ui'

class ModalSetLatLongForm extends React.PureComponent {
    state = {
        latLong: ''
    }

    componentDidMount(){
        const { latLong } = this.props
        if(latLong) {
            this.setState({ latLong })
        }
    }

    componentDidUpdate(prevProps) {
        const { latLong, error } = this.props

        // If Props Lat-Long Changes
        if(prevProps.latLong !== latLong) {
            this.setState({ latLong })
        }

        // If Props error Changes
        if(prevProps.error.message !== error.message) {
            this.props.setError(error)
        }
    }

    handleOnChange = event => {
        this.setState({ latLong: event.target.value })
    }

    handleFormSubmit = event => {
        event.preventDefault()

        // Split Marker Co-ordinates
        let { latLong } = this.state
        let { error } = this.props
        latLong = latLong.split(',')

        // Validity Checks from Input Field
        if(latLong.length !== 2) {
            this.props.setError({ message: 'Provide Comma-separated Lat-Long' })
            return
        }

        for(let i = 0; i < latLong.length; i++) {
            latLong[i] = latLong[i].trim()
            if(Number.isNaN(latLong[i])) {
                this.props.setError({ message: 'Provide Valid Number' })
                return
            }
        }

        // Get Latitude and Longitude
        const latitude = parseFloat(latLong[0])
        const longitude = parseFloat(latLong[1])

        // Validity Checks for Latitude and Longitude
        latLongValidator(latitude, longitude)
            .then(res => {
                if(!res.error.message) {
                    this.props.setModalPlaceData(res.data)

                    if(error.message) {
                        this.props.setError(res.error)
                    }
                    
                } else {
                    this.props.setError(res.error)
                }
            })
            .catch(err => console.error(err))
    }

    render() {
        const { latLong } = this.state
        const { error } = this.props

        return (
            <form onSubmit={ this.handleFormSubmit } style={ formStyles }>
                <TextInputField
                    label='Lat-Long'
                    placeholder='Lat, Long...'
                    required={ true }
                    isInvalid={ error.message ? true : false }
                    validationMessage={ error.message ? error.message : null }
                    width='100%'
                    value={ latLong }
                    onChange={ this.handleOnChange }
                />
                <Button
                    appearance='primary'
                    intent='success'
                    transform={ error.message ? 'translateY(-13px)' : null }
                >
                    Set
                </Button>
            </form>
        )
    }
}

const formStyles = {
    margin: '0',
    padding: '0',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
}

ModalSetLatLongForm.propTypes = {
    latLong: PropTypes.string,
    error: PropTypes.object,
    setModalPlaceData: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
}

export default ModalSetLatLongForm
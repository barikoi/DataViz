import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import UpdateModalMap from './UpdateModalMap'
import UpdateModalActionPanel from './UpdateModalActionPanel'
import UpdateModalSearchBox from './UpdateModalSearchBox'
import UpdateModalInfoBox from './UpdateModalInfoBox'
import UpdateForm from './UpdateForm'
import { Carousel } from 'react-responsive-carousel'
import { SearchInput, Autocomplete } from 'evergreen-ui'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import './css/UpdateModalStyles.css'

const REVERSE_GEO_API_URL = '/reverse/without/auth'

class UpdateModal extends React.PureComponent {
    state = {
        data: {
            private_public_flag: 1
        },
        searchInput: '',
        reverseGeoInfo: null
    }

    componentDidUpdate(prevProps, prevState) {
        let { latitude, longitude } = this.state.data
        let { updateModalInputData } = this.props
        if((prevState.data.latitude !== latitude || prevState.data.longitude !== longitude) && (latitude !== updateModalInputData.latitude || longitude !== updateModalInputData.longitude)) {
            axios.get(REVERSE_GEO_API_URL, { params: { latitude, longitude } })
                .then(results => {
                    const reverseGeoInfo = results.data[0]
                    this.setState({ reverseGeoInfo })
                })
                .catch(err => console.error(err))
        }
    }

    handleFormSubmit = values => {
        new Promise(resolve => {
            // Omit Empty data
            for(const key in values) {
                if(values[key] === '') {
                    delete values[key]
                }
            }

            this.setState({ data: { ...this.state.data, ...values } })
            resolve()
        })
        .then(() => {
            this.handleModalDataSubmit()
        })
    }

    handleMapFormSubmit = values => {
        this.setState({ data: { ...this.state.data, latitude: values.lat, longitude: values.long } })
    }

    handleSearchOnChange = event => {
        this.setState({ searchInput: event.target.value })
    }
    
    handleUpdateSearchSubmit = event => {
        if(event.key === 'Enter') {
            console.log('Search', this.state.searchInput)
        }
    }

    handleModalDataSubmit = () => {
        this.props.handleModalData(this.state.data)
    }
    
    render() {
        const { updateModalInputData } = this.props
        const { reverseGeoInfo } = this.state
        return (
            <div className='modal-container'>
                <div className='modal-overlay'></div>
                <div className='modal-body'>
                    <div className='close-modal' onClick={ this.props.closeModal }><span>X</span></div>
                    <div className='modal-content'>
                        <div className='map-panel'>
                            <UpdateModalMap
                                handleMapFormSubmit={ this.handleMapFormSubmit }
                                markerCoordinates={{ lat: updateModalInputData.latitude, long: updateModalInputData.longitude }}
                            />
                            { updateModalInputData.image &&
                                <Carousel renderThumbs={ () => null }>
                                    <div>
                                        <img src={ process.env.REACT_APP_BASE_API_URL + updateModalInputData.image.image_link } />
                                    </div>
                                </Carousel>
                            }
                        </div>
                        <UpdateModalActionPanel>
                            {/* <UpdateModalSearchBox handleSearchSubmit={ this.handleUpdateSearchSubmit } /> */}

                            <div className='autocomplete-container'>
                                <Autocomplete
                                    title='Places'
                                    items={ ['Apple', 'Apricot', 'Banana', 'Cherry', 'Cucumber'] }
                                    onChange={ changedItem => console.log(changedItem) }
                                >
                                    { props => {
                                        const { getInputProps, getRef, inputValue } = props
                                        return (
                                            <SearchInput
                                                placeholder="Search places..."
                                                width="100%"
                                                boxSizing='border-box'
                                                paddingLeft='15px'
                                                paddingRight='15px'
                                                height={ 40 }
                                                zIndex={ 1200 }
                                                value={ inputValue }
                                                ref={ getRef }
                                                { ...getInputProps() }
                                            />
                                        )
                                    }}
                                </Autocomplete>
                            </div>

                            <UpdateModalInfoBox
                                info={ reverseGeoInfo ? reverseGeoInfo.Address : updateModalInputData.Address }
                            />

                            <UpdateForm
                                handleFormSubmit={ this.handleFormSubmit }
                                autofillData={ reverseGeoInfo ?
                                    {
                                        ...updateModalInputData,
                                        area: reverseGeoInfo.area,
                                        city: reverseGeoInfo.city,
                                        postCode: reverseGeoInfo.postCode,
                                        thana: reverseGeoInfo.thana,
                                        unions: reverseGeoInfo.unions,
                                        sub_district: reverseGeoInfo.sub_district,
                                        district: reverseGeoInfo.district
                                    }
                                    : updateModalInputData
                                }
                            />
                        </UpdateModalActionPanel>
                    </div>
                </div>
            </div>
        )    
    }
}

UpdateModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    handleModalData: PropTypes.func.isRequired,
    updateModalInputData: PropTypes.object.isRequired
}

export default UpdateModal
import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import UpdateModalMap from './UpdateModalMap'
import UpdateModalActionPanel from './UpdateModalActionPanel'
import UpdateModalSearchBox from './UpdateModalSearchBox'
import UpdateModalInfoBox from './UpdateModalInfoBox'
import UpdateForm from './UpdateForm'
import { Carousel } from 'react-responsive-carousel'
import { SearchInput, Autocomplete, Position } from 'evergreen-ui'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import './css/UpdateModalStyles.css'

const REVERSE_GEO_API_URL = '/reverse/without/auth'
const SEARCH_API_URL = '/tnt/search/admin'

class UpdateModal extends React.PureComponent {
    state = {
        data: {
            private_public_flag: 1
        },
        searchInput: '',
        reverseGeoInfo: null,
        isAutocompleteFetching: false,
        autoCompleteList: []
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

        if((prevState.isAutocompleteFetching !== this.state.isAutocompleteFetching && this.state.isAutocompleteFetching) && (prevState.searchInput !== this.state.searchInput && this.state.searchInput)) {
            axios.post(SEARCH_API_URL, { search: this.state.searchInput })
                .then(res => {
                    const autoCompleteList = res.data.places.map(item => item.Address)
                    this.setState({ autoCompleteList, isAutocompleteFetching: false })
                })
                .catch(err => {
                    console.error(err)
                })
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

    handleModalDataSubmit = () => {
        this.props.handleModalData(this.state.data)
    }

    fetchSearchAutocompleteList = (items, searchInput) => {
        // If Search Empty
        if(!searchInput) {
            return []

        } else {
            if(!this.state.isAutocompleteFetching && searchInput !== this.state.searchInput) {
                console.log('Search:', searchInput)
                this.setState({ isAutocompleteFetching: true, searchInput })
            }

            return this.state.autoCompleteList
        }
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
                                    items={ [] }
                                    position={ Position.BOTTOM_LEFT }
                                    onChange={ changedItem => console.log(changedItem) }
                                    itemsFilter={ this.fetchSearchAutocompleteList }
                                    popoverMinWidth={ 500 }
                                    selectedItem={ null }
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
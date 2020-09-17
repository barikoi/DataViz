import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import UpdateModalMap from './UpdateModalMap'
import UpdateModalActionPanel from './UpdateModalActionPanel'
import UpdateModalInfoBox from './UpdateModalInfoBox'
import UpdateForm from './UpdateForm'
import { Carousel } from 'react-responsive-carousel'
import { SearchInput, Autocomplete, Position } from 'evergreen-ui'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import './css/UpdateModalStyles.css'

const SEARCH_API_URL = '/search/autocomplete/admin'

class UpdateModal extends React.PureComponent {
    state = {
        data: null,
        searchInput: '',
        isAutocompleteFetching: false,
        autoCompleteList: []
    }

    componentDidMount() {
        const { updateModalInputData } = this.props
        this.setState({ data: updateModalInputData })
    }

    componentDidUpdate(prevProps, prevState) {
        // If Search Input Changes for autocomplete
        if(prevState.isAutocompleteFetching !== this.state.isAutocompleteFetching && this.state.isAutocompleteFetching) {
            axios.get(SEARCH_API_URL, { params: { search: this.state.searchInput } })
                .then(res => {
                    const autoCompleteList = res.data.places
                    this.setState({ autoCompleteList, isAutocompleteFetching: false })
                })
                .catch(err => {
                    console.error(err)
                    this.setState({ autoCompleteList: [], isAutocompleteFetching: false })
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

    handleMapFormSubmit = data => {
        this.setState({ data })
    }

    handleModalDataSubmit = () => {
        const { data } = this.state
        // Filter Submit Data
        const filteredData = {
            business_name: data.business_name,
            place_name: data.place_name,
            holding_number: data.holding_number,
            road_name_number: data.road_name_number,
            super_sub_area: data.super_sub_area,
            sub_area: data.sub_area,
            area: data.area,
            city: data.city,
            postCode: data.postCode,
            thana: data.thana,
            district: data.district,
            sub_district: data.sub_district,
            unions: data.unions,
            popularity_ranking: data.popularity_ranking,
            image: data.image,
            pType: data.pType,
            subType: data.subType,
            latitude: data.latitude,
            longitude: data.longitude,
            private_public_flag: 1
        }

        this.props.handleModalData(filteredData)
    }

    fetchSearchAutocompleteList = (items, searchInput) => {
        // Won't reach here if empty
        if(!this.state.isAutocompleteFetching && searchInput !== this.state.searchInput) {
            this.setState({ isAutocompleteFetching: true, searchInput })
        }

        return this.state.autoCompleteList.filter(item => item.Address).map(item => item.Address)
    }

    handleOnAutocompleteSelect = selectedItem => {
        // Handle Selected Item and autofill form
        const selectedPlace = this.state.autoCompleteList.find(item => item.Address === selectedItem)
        this.setState({ searchInput: '', autoCompleteList: [], data: selectedPlace })
    }

    resetToInitialProps = () => {
        const { updateModalInputData } = this.props
        this.setState({ data: { ...updateModalInputData }, searchInput: '', isAutocompleteFetching: false, autoCompleteList: [] })
    }
    
    render() {
        const { data } = this.state
        if(!data) return null

        return (
            <div className='modal-container'>
                <div className='modal-overlay'></div>
                <div className='modal-body'>
                    <div className='close-modal' onClick={ this.props.closeModal }><span>X</span></div>
                    <div className='modal-content'>
                        <div className='map-panel'>
                            <UpdateModalMap
                                handleMapFormSubmit={ this.handleMapFormSubmit }
                                markerCoordinates={{ latitude: data.latitude, longitude: data.longitude }}
                            />
                            { data.image &&
                                <Carousel renderThumbs={ () => null }>
                                    <div>
                                        <img src={ process.env.REACT_APP_BASE_API_URL + data.image.image_link } />
                                    </div>
                                </Carousel>
                            }
                        </div>
                        <UpdateModalActionPanel>
                            <div className='autocomplete-container'>
                                <Autocomplete
                                    title='Places'
                                    items={ [] }
                                    position={ Position.BOTTOM_LEFT }
                                    onChange={ this.handleOnAutocompleteSelect }
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
                                info={ data.Address }
                            />

                            <UpdateForm
                                handleFormSubmit={ this.handleFormSubmit }
                                autofillData={ data }
                                resetToInitialProps={ this.resetToInitialProps }
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
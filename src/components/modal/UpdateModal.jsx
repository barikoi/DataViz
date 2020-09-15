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
        data: null,
        searchInput: '',
        isAutocompleteFetching: false,
        isRverseGeoOn: false,
        autoCompleteList: []
    }

    componentDidMount() {
        const { updateModalInputData } = this.props
        this.setState({ data: updateModalInputData })
    }

    componentDidUpdate(prevProps, prevState) {
        let { latitude, longitude } = this.state.data ? this.state.data : { latitude: null, longitude: null }

        // If Lat long changes on the Map for Reverse Geo
        if(prevState.data && (prevState.data.latitude !== latitude || prevState.data.longitude !== longitude)) {
            axios.get(REVERSE_GEO_API_URL, { params: { latitude, longitude } })
                .then(results => {
                    const reverseGeoInfo = results.data[0]
                    this.setState({ data: reverseGeoInfo, isRverseGeoOn: false })
                })
                .catch(err => console.error(err))
        }

        // If Search Input Changes for autocomplete
        if(prevState.isAutocompleteFetching !== this.state.isAutocompleteFetching && this.state.isAutocompleteFetching) {
            axios.post(SEARCH_API_URL, { search: this.state.searchInput })
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
        // new Promise(resolve => {
        //     // Omit Empty data
        //     for(const key in values) {
        //         if(values[key] === '') {
        //             delete values[key]
        //         }
        //     }

        //     this.setState({ data: { ...this.state.data, ...values } })
        //     resolve()
        // })
        // .then(() => {
        //     this.handleModalDataSubmit()
        // })
    }

    handleMapFormSubmit = values => {
        this.setState({ data: { ...this.state.data, latitude: values.latitude, longitude: values.longitude }, isRverseGeoOn: true })
    }

    handleModalDataSubmit = () => {
        // this.props.handleModalData(this.state.data)
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
        this.setState({ data: updateModalInputData, searchInput: '', isAutocompleteFetching: false, autoCompleteList: [], isRverseGeoOn: false })
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
                            {/* <UpdateModalSearchBox handleSearchSubmit={ this.handleUpdateSearchSubmit } /> */}

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
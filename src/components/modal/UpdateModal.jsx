import React from 'react'
import PropTypes from 'prop-types'

import UpdateModalMap from './UpdateModalMap'
import UpdateModalActionPanel from './UpdateModalActionPanel'
import UpdateModalSearchBox from './UpdateModalSearchBox'
import UpdateModalInfoBox from './UpdateModalInfoBox'
import UpdateForm from './UpdateForm'

import './css/UpdateModalStyles.css'

class UpdateModal extends React.PureComponent {
    state = {
        data: {
            private_public_flag: 1
        },
        searchInput: ''
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
    
    handleUpdateSearchSubmit = searchInput => {
        this.setState({ searchInput })
    }

    handleModalDataSubmit = () => {
        this.props.handleModaData(this.state.data)
    }
    
    render() {
        const { updateModalInputData } = this.props;
        return (
            <div className='modal-container'>
                <div className='modal-overlay'></div>
                <div className='modal-body'>
                    <div className='close-modal' onClick={ this.props.closeModal }><span>X</span></div>
                    <div className='modal-content'>
                        <UpdateModalMap
                            handleMapFormSubmit={ this.handleMapFormSubmit }
                            markerCoordinates={{ lat: updateModalInputData.latitude, long: updateModalInputData.longitude }}
                        />
                        <UpdateModalActionPanel>
                            <UpdateModalSearchBox handleSearchSubmit={ this.handleUpdateSearchSubmit } />
                            <UpdateModalInfoBox info={ updateModalInputData.Address } />
                            <UpdateForm handleFormSubmit={ this.handleFormSubmit } autofillData={ updateModalInputData } />
                        </UpdateModalActionPanel>
                    </div>
                </div>
            </div>
        )    
    }
}

UpdateModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    handleModaData: PropTypes.func.isRequired,
    updateModalInputData: PropTypes.object.isRequired
}

export default UpdateModal
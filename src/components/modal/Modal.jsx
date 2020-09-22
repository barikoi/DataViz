import React from 'react'
import PropTypes from 'prop-types'
import { replaceNullKeys } from '../../utils/objectUtils'

// Import Components
import { Pane, Dialog, Button } from 'evergreen-ui'
import ModalMapPanel from './ModalMapPanel'
import ModalFormPanel from './ModalFormPanel'

class Modal extends React.Component {
    state = {
        place: null
    }

    componentDidMount() {
        const { place } = this.props
        if(place) {
            const refinedPlace = replaceNullKeys(place)
            this.setState({ place: refinedPlace })
        }
    }

    // If place data is updated from reverse Geo or search select
    setModalPlaceData = placeData => {
        return new Promise(resolve => {
            const { place } = this.state
            const refinedPlace = replaceNullKeys(placeData)

            // If Lat-Long not passed (i.e from Form)
            if(!refinedPlace.latitude || !refinedPlace.longitude) {
                this.setState({ place: { ...place, ...refinedPlace } })

            } else {
                this.setState({ place: refinedPlace })
            }

            resolve()
        })
    }

    // Render Footer
    renderFooter = () => {
        const { isConfirmLoading, confirmLabel } = this.props

        return (
            <Pane
                width='100%'
                minWidth='77vw'
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
            >
                <Button appearance='default' intent='danger' marginRight='auto'>Cancel</Button>
                <Button appearance='default' intent='warning' marginRight={ 20 }>Reset</Button>
                <Button
                    appearance='primary'
                    intent='success'
                    form='modal-form'
                    type='submit'
                >
                    { isConfirmLoading ? 'Loading...' : confirmLabel }
                </Button>
            </Pane>
        )
    }

    // On Confirm Button Click
    onConfirmClick = () => {
        const { place } = this.state

        // Filter Submittable Data
        const submittablePlaceData = {
            business_name: place.business_name,
            place_name: place.place_name,
            holding_number: place.holding_number,
            road_name_number: place.road_name_number,
            super_sub_area: place.super_sub_area,
            sub_area: place.sub_area,
            area: place.area,
            city: place.city,
            postCode: place.postCode,
            thana: place.thana,
            district: place.district,
            sub_district: place.sub_district,
            unions: place.unions,
            popularity_ranking: place.popularity_ranking,
            images: place.images,
            pType: place.pType,
            subType: place.subType,
            latitude: place.latitude,
            longitude: place.longitude,
            private_public_flag: 1
        }

        // Check for invalid values
        Object.keys(submittablePlaceData).forEach(key => {
            if(!submittablePlaceData[key]) {
                delete submittablePlaceData[key]
            }
        })

        // Call Props onConfirm to pass modal data
        this.props.onConfirm(submittablePlaceData)
    }

    render() {
        const { place } = this.state
        const { title, isModalShown, onCloseComplete, isConfirmLoading } = this.props

        return (
            <Dialog
                isShown={ isModalShown }
                title={ title }
                onCloseComplete={ onCloseComplete }
                width={ '80%' }
                preventBodyScrolling={ true }
                shouldCloseOnOverlayClick={ false }
                shouldCloseOnEscapePress={ false }
                intent='success'
                isConfirmLoading={ isConfirmLoading }
                topOffset={ '1vmin' }
                footer={ this.renderFooter }
            >
                <Pane
                    width='100%'
                    display='flex'
                    flexDirection='row'
                    justifyContent='center'
                    alignItems='flex-start'
                >
                    <ModalMapPanel
                        latitude={ place ? place.latitude : null }
                        longitude={ place ? place.longitude : null }
                        setModalPlaceData={ this.setModalPlaceData }
                    />

                    <ModalFormPanel
                        place={ place }
                        setModalPlaceData={ this.setModalPlaceData }
                        onConfirmClick={ this.onConfirmClick }
                    />
                </Pane>
            </Dialog>
        )
    }
}

Modal.propTypes = {
    isModalShown: PropTypes.bool,
    onCloseComplete: PropTypes.func.isRequired,
    title: PropTypes.string,
    confirmLabel: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    place: PropTypes.object
}

Modal.defaultProps = {
    place: null,
    isModalShown: false,
    title: 'Dialog',
    confirmLabel: 'Confirm'
}

export default Modal
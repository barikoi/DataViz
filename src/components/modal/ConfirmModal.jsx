import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Dialog, Heading } from 'evergreen-ui'

class ConfirmModal extends React.PureComponent {
    render() {
        const { isModalShown, title, onCloseComplete, onConfirm, confirmLabel, modalContent } = this.props

        return (
            <Dialog
                isShown={ isModalShown }
                title={ title }
                onCloseComplete={ onCloseComplete }
                width='40%'
                preventBodyScrolling={ true }
                shouldCloseOnOverlayClick={ false }
                shouldCloseOnEscapePress={ false }
                intent='danger'
                onConfirm={ onConfirm }
                confirmLabel={ confirmLabel }
            >
                <Heading>{ modalContent }</Heading>
            </Dialog>
        )
    }
}

ConfirmModal.propTypes = {
    isModalShown: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCloseComplete: PropTypes.func.isRequired,
    title: PropTypes.string,
    confirmLabel: PropTypes.string,
    place: PropTypes.object,
    modalContent: PropTypes.string
}

ConfirmModal.defaultProps = {
    title: 'Confirm Action',
    confirmLabel: 'Confirm',
    place: null,
    modalContent: 'Are you sure?'
}

export default ConfirmModal
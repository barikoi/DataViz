import React from 'react'
import PropTypes from 'prop-types'

import './css/UpdateModalInfoBoxStyles.css'

class UpdateModalInfoBox extends React.PureComponent {
    render() {
        return (
            <div className='update-modal-info-box'>
                <input type='text' id='info-box' name='info' placeholder='Address...' value={ this.props.info } disabled={ true } />
            </div>
        )
    }
}

UpdateModalInfoBox.propTypes = {
    info: PropTypes.string
}

UpdateModalInfoBox.defaultProps = {
    info: ''
}

export default UpdateModalInfoBox
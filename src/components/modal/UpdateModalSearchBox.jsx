import React from 'react'
import PropTypes from 'prop-types'

import './css/UpdateModalSearchBoxStyles.css'

class UpdateModalSearchBox extends React.PureComponent {
    state = {
        searchInput: ''
    }

    handleOnChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleOnSubmit = event => {
        event.preventDefault()
        this.props.handleSearchSubmit(this.state.searchInput)
    }

    render() {
        return (
            <div className='search-box'>
                <form className='search-form' onSubmit={ this.handleOnSubmit }>
                    <input type='text' id='search-input' name='searchInput' placeholder='Search here...' value={ this.state.searchInput } onChange={ this.handleOnChange } />
                </form>
            </div>
        )
    }
}

UpdateModalSearchBox.propTypes = {
    handleSearchSubmit: PropTypes.func.isRequired
}

export default UpdateModalSearchBox
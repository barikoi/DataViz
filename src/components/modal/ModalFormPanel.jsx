import React from 'react'
import PropTypes from 'prop-types'
import { fetchSearchAutocompleteList } from '../../utils/fetchData'

// Import Components
import { Pane, Autocomplete, SearchInput, Position } from 'evergreen-ui'
import ModalForm from './ModalForm'

class ModalFormPanel extends React.PureComponent {
    state = {
        searchInput: '',
        isAutocompleteFetching: false,
        autoCompleteList: []
    }

    componentDidUpdate(prevProps, prevState) {
        const { isAutocompleteFetching, searchInput } = this.state

        // If Search Input Changes for autocomplete
        if(prevState.isAutocompleteFetching !== isAutocompleteFetching && isAutocompleteFetching) {
            fetchSearchAutocompleteList(searchInput)
                .then(autoCompleteList => {
                    if(!autoCompleteList) {
                        autoCompleteList = []
                    }
                    this.setState({ autoCompleteList, isAutocompleteFetching: false })
                })
                .catch(err => {
                    console.error(err)
                    this.setState({ autoCompleteList: [], isAutocompleteFetching: false })
                })
        }
    }

    // Handle Autocomplete Select
    handleOnAutocompleteSelect = selectedItem => {
        const { autoCompleteList } = this.state

        // Handle Selected Item and autofill form
        const selectedPlace = autoCompleteList.find(item => item.Address === selectedItem)
        this.setState({ searchInput: '', autoCompleteList: [] })

        // Set Place Data
        this.props.setModalPlaceData(selectedPlace)
    }

    // Handle Autocomplete Fetch List
    handleSearchAutocomplete = (items, searchInputParam) => {
        const { isAutocompleteFetching, searchInput, autoCompleteList } = this.state

        // Won't reach here if empty
        if(!isAutocompleteFetching && searchInputParam !== searchInput) {
            this.setState({ isAutocompleteFetching: true, searchInput: searchInputParam, autoCompleteList: [] })
        }

        return autoCompleteList.filter(item => item.Address).map(val => val.Address)
    }

    render() {
        const { place, setModalPlaceData, onConfirmClick, skipKeys } = this.props

        return (
            <Pane
                background='tint1'
                elevation={ 2 }
                border='muted'
                display='flex'
                flexDirection='column'
                justifyContent='flex-start'
                alignItems='center'
                width='100%'
                padding={ 10 }
            >
                <Pane margin={ 0 } padding={ 0 } marginBottom={ 20 } width='100%'>
                    <Autocomplete
                        title='Places'
                        items={ [] }
                        position={ Position.BOTTOM_LEFT }
                        onChange={ this.handleOnAutocompleteSelect }
                        itemsFilter={ this.handleSearchAutocomplete }
                        popoverMinWidth={ 500 }
                        selectedItem={ null }
                    >
                        { props => {
                            const { getInputProps, getRef, inputValue } = props
                            return (
                                <SearchInput
                                    placeholder="Search places..."
                                    width="100%"
                                    height={ 40 }
                                    value={ inputValue }
                                    ref={ getRef }
                                    { ...getInputProps() }
                                />
                            )
                        }}
                    </Autocomplete>
                </Pane>

                <ModalForm
                    place={ place }
                    setModalPlaceData={ setModalPlaceData }
                    onConfirmClick={ onConfirmClick }
                    skipKeys={ skipKeys }
                />
            </Pane>
        )
    }
}

ModalFormPanel.propTypes = {
    place: PropTypes.object,
    setModalPlaceData: PropTypes.func.isRequired,
    onConfirmClick: PropTypes.func.isRequired,
    skipKeys: PropTypes.array
}

ModalFormPanel.defaultProps = {
    place: null,
    skipKeys: null
}

export default ModalFormPanel
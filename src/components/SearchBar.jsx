import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Pane, Autocomplete, SearchInput, Position } from 'evergreen-ui'

// Import Actions
import { fetchSearchAutocompleteList } from '../utils/fetchData'

class SearchBar extends React.PureComponent {
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

        // Set Map Lat Long
        this.props.handleMapSearchSubmission(selectedPlace)
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
        return (
            <Pane { ...searchBarContainerStyles } >
                <Autocomplete
                    title='Places'
                    items={ [] }
                    position={ Position.BOTTOM_LEFT }
                    onChange={ this.handleOnAutocompleteSelect }
                    itemsFilter={ this.handleSearchAutocomplete }
                    popoverMinWidth={ 300 }
                    selectedItem={ null }
                >
                    { props => {
                        const { getInputProps, getRef, inputValue } = props
                        return (
                            <SearchInput
                                margin={ 0 }
                                padding={ 0 }
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
        )
    }
}

// JSS Styles
const searchBarContainerStyles = {
    margin: '0',
    padding: '0',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: '5',
    top: '16px',
    left: '50%'
}

SearchBar.propTypes = {
    handleMapSearchSubmission: PropTypes.func.isRequired
}

export default SearchBar
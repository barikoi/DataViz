import React from 'react'
import PropTypes from 'prop-types'
import { fetchPTypeList, fetchSubTypeListForPType } from '../../utils/fetchData'
import { filterPlaceProp } from '../../utils/objectUtils'

// Import Components
import { TextInputField, FilePicker, Pane, Heading, Text, InfoSignIcon } from 'evergreen-ui'
import ReactSelect from 'react-select'

const INITIAL_STATE = {
    Address: '',
    business_name: '',
    place_name: '',
    holding_number: '',
    road_name_number: '',
    super_sub_area: '',
    sub_area: '',
    area: '',
    city: '',
    postCode: '',
    thana: '',
    district: '',
    sub_district: '',
    unions: '',
    popularity_ranking: '',
    images: [],
    pType: '',
    subType: '',
    pTypeList: [],
    subTypeList: [],
    error: {}
}

class ModalForm extends React.PureComponent {
    state = {
        Address: '',
        business_name: '',
        place_name: '',
        holding_number: '',
        road_name_number: '',
        super_sub_area: '',
        sub_area: '',
        area: '',
        city: '',
        postCode: '',
        thana: '',
        district: '',
        sub_district: '',
        unions: '',
        popularity_ranking: '',
        images: [],
        pType: '',
        subType: '',
        pTypeList: [],
        subTypeList: [],
        error: {},
        newSubType: ''
    }

    componentDidMount() {
        // Populate props to state if props place exists
        const { place } = this.props
        if(place) {
            // Filter input Props
            let filteredProps = filterPlaceProp(place, this.state)
            this.setState({ ...this.state, ...filteredProps })
        }

        // Populate pTypeList
        fetchPTypeList()
            .then(pTypeList => {
                this.setState({ pTypeList })
            })
            .catch(err => console.error(err))
    }

    componentDidUpdate(prevProps, prevState) {
        const { pType, subType, pTypeList, subTypeList } = this.state
        const { place } = this.props
        
        // If place props changes
        if((!prevProps.place && place)
            || (place && prevProps.place && prevProps.place.uCode !== place.uCode)
            || (place && prevProps.place && prevProps.place.latitude !== place.latitude)
            || (place && prevProps.place && prevProps.place.longitude !== place.longitude)) {
            console.log('Place Prop Changed')

            // Filter input Props
            let filteredProps = filterPlaceProp(place, this.state)
            this.setState({ ...INITIAL_STATE, pTypeList, subTypeList, ...filteredProps })
        }

        // If pType Changes in State and pType is empty
        if(prevState.pType !== pType) {
            if(!pType.trim()) {
                // If pType empty
                this.setState({ subType: '', subTypeList: [] })
            } else {
                console.log('pType State Changed')
                // Fetch subTypeList based on pType and filtered subType if parent pType is removed
                fetchSubTypeListForPType(pType, subType)
                    .then(res => {
                        this.setState({
                            subTypeList: res.subTypeList,
                            subType: res.refinedSubType,
                            newSubType: res.newSubType
                        })
                    })
                    .catch(err => console.error(err))
            }
        }

        // If Subtype Changes
        if(prevState.subType !== subType) {
            if(!subType.trim()) {
                this.setState({ newSubType: '' })

            } else {

            }
        }
    }

    // Handle Input OnChange
    handleOnChange = event => {
        let value = event.target.value

        // For Number Inputs
        if(event.target.type === 'number') {
            value = parseInt(event.target.value)
        }

        // Delete Address error if error exists
        const { error } = this.state
        if(event.target.name === 'Address' && error.Address && value) {
            delete error.Address
            this.setState({ error })
        }

        this.setState({ [event.target.name]: value })
    }

    // Image Upload Handler
    handleImageUploadOnChange = files => {
        this.setState({ images: files })
    }

    // Handle pType Select On Change
    handlePTypeSelectOnChange = values => {
        if(!values) {
            this.setState({ pType: '' })
            return
        }

        // Delete Error if Error exists
        const { error } = this.state
        if(error.pType) {
            delete error.pType
            this.setState({ error })
        }

        this.setState({ pType: values.map(item => item.label).join(', ') })
    }

    // Handle subType Select On Change
    handleSubTypeSelectOnChange = values => {
        if(!values) {
            this.setState({ subType: '' })
            return
        }

        // Delete Error if Error exists
        const { error } = this.state
        if(error.subType) {
            delete error.subType
            this.setState({ error })
        }

        this.setState({ subType: values.map(item => item.label).join(', ') })
    }

    // Handle Form Data Submission
    handleOnFormSubmit = event => {
        event.preventDefault()

        // Check Input Validity
        const { Address, pType, subType } = this.state
        const error = {}
        if(!Address) {
            error.Address = 'Address is required!'
        }
        
        if(!pType) {
            error.pType = 'P-Type is required!'
        }

        if(!subType) {
            error.subType = 'Sub-Type is required!'
        }

        if(Object.keys(error).length > 0) {
            this.setState({ error })
            return
        }

        // Handle Form Submission
        const submittableValues = this.filterFormSubmitValues()
        this.props.setModalPlaceData(submittableValues)
            .then(() => {
                this.props.onConfirmClick()
            })
            .catch(err => console.error(err))
    }

    // Filter Form Sumbit Values
    filterFormSubmitValues = () => {
        let filteredValues = {}
        Object.keys(this.state).forEach(key => {
            if(key !== 'pTypeList' && key !== 'subTypeList' && key !== 'error' && key !== 'newSubType') {
                filteredValues[key] = this.state[key]
            }
        })

        // Add newSubType to subType
        filteredValues.subType += ', ' + this.state.newSubType

        return filteredValues
    }

    render() {
        const { Address, business_name, place_name, holding_number, road_name_number, super_sub_area, sub_area, area, city, postCode, thana, district, sub_district, unions, popularity_ranking, pType, subType, pTypeList, subTypeList, error } = this.state

        return (
            <form id='modal-form' onSubmit={ this.handleOnFormSubmit } style={ formStyles }>
                <TextInputField
                    name='Address'
                    label='Address'
                    placeholder='Address...'
                    disabled={ true }
                    width='100%'
                    value={ Address ? Address : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/7'
                    isInvalid={ error.Address ? true : false }
                    validationMessage={ error.Address ? error.Address : null }
                />

                <TextInputField
                    name='business_name'
                    label='Name'
                    placeholder='Name...'
                    width='100%'
                    value={ business_name ? business_name : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/7'
                />

                <TextInputField
                    name='place_name'
                    label='Building/Market'
                    placeholder='Building/Market...'
                    width='100%'
                    value={ place_name ? place_name : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/7'
                />

                <TextInputField
                    name='holding_number'
                    label='Holding'
                    placeholder='Holding...'
                    width='100%'
                    value={ holding_number ? holding_number : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/3'
                />

                <TextInputField
                    name='road_name_number'
                    label='Road'
                    placeholder='Road...'
                    width='100%'
                    value={ road_name_number ? road_name_number : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='3/7'
                />

                <TextInputField
                    name='super_sub_area'
                    label='Super Sub Area'
                    placeholder='Super Sub Area...'
                    width='100%'
                    value={ super_sub_area ? super_sub_area : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/3'
                />

                <TextInputField
                    name='sub_area'
                    label='Sub Area'
                    placeholder='Sub Area...'
                    width='100%'
                    value={ sub_area ? sub_area : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='3/5'
                />

                <TextInputField
                    name='area'
                    label='Area'
                    placeholder='Area...'
                    width='100%'
                    value={ area ? area : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='5/7'
                />

                <TextInputField
                    name='city'
                    label='City'
                    placeholder='City...'
                    width='100%'
                    value={ city ? city : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/3'
                />

                <TextInputField
                    name='postCode'
                    label='Post Code'
                    placeholder='Post Code...'
                    width='100%'
                    value={ postCode ? postCode : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='3/5'
                />

                <TextInputField
                    name='thana'
                    label='Thana'
                    placeholder='Thana...'
                    width='100%'
                    value={ thana ? thana : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='5/7'
                />

                <TextInputField
                    name='district'
                    label='District'
                    placeholder='District...'
                    width='100%'
                    value={ district ? district : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/3'
                />

                <TextInputField
                    name='sub_district'
                    label='Sub District'
                    placeholder='Sub District...'
                    width='100%'
                    value={ sub_district ? sub_district : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='3/5'
                />

                <TextInputField
                    name='unions'
                    label='Unions'
                    placeholder='Unions...'
                    width='100%'
                    value={ unions ? unions : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='5/7'
                />

                <TextInputField
                    type='number'
                    name='popularity_ranking'
                    label='Popularity Ranking'
                    placeholder='Popularity Ranking...'
                    width='100%'
                    value={ popularity_ranking ? popularity_ranking : '' }
                    onChange={ this.handleOnChange }
                    gridColumn='1/3'
                />

                <Pane
                    margin={ 0 }
                    padding={ 0 }
                    gridColumn='3/5'
                >
                    <Heading size={ 400 } marginBottom={ 4 } >Upload Images</Heading>
                    <FilePicker
                        name='images'
                        placeholder='Upload Images...'
                        multiple={ true }
                        accept='image/*'
                        width={ 0 }
                        onChange={ this.handleImageUploadOnChange }
                    />
                </Pane>

                <Pane
                    margin={ 0 }
                    padding={ 0 }
                    gridColumn='1/4'
                >
                    <Heading size={ 400 } marginBottom={ 4 } >P-Type *</Heading>

                    <ReactSelect
                        options={ pTypeList }
                        value={ pTypeList.filter(item =>
                            pType.split(',').map(val => val.trim().toLowerCase())
                                .includes(item.value)
                        )}
                        styles={ reactSelectStyles }
                        isMulti={ true }
                        closeMenuOnSelect={ false }
                        onChange={ this.handlePTypeSelectOnChange }
                        menuShouldScrollIntoView={ true }
                    />

                    {
                        error.pType &&
                        <Pane
                            display='flex'
                            flexDirection='row'
                            justifyContent='flex-start'
                            alignItems='center'
                            paddingTop={ 8 }
                            paddingBottom={ 8 }
                        >
                            <InfoSignIcon color='danger' marginRight={ 8 }/>
                            <Text size={ 300 } color='danger'>{ error.pType }</Text>
                        </Pane>
                    }
                </Pane>

                <Pane
                    margin={ 0 }
                    padding={ 0 }
                    gridColumn='4/7'
                >
                    <Heading size={ 400 } marginBottom={ 4 } >Sub-Type *</Heading>

                    <ReactSelect
                        options={ subTypeList }
                        value={ subTypeList.map(item => item.options).flat()
                            .filter(val => subType.split(',').map(el => el.trim().toLowerCase()).includes(val.value))
                        }
                        styles={ reactSelectStyles }
                        isMulti={ true }
                        closeMenuOnSelect={ false }
                        onChange={ this.handleSubTypeSelectOnChange }
                        menuShouldScrollIntoView={ true }
                    />

                    { this.state.newSubType &&
                        <Text>
                            <Heading size={ 400 }>New Sub-Type: </Heading>
                            <Text>{ this.state.newSubType }</Text>
                        </Text>
                    }

                    {
                        error.subType &&
                        <Pane
                            display='flex'
                            flexDirection='row'
                            justifyContent='flex-start'
                            alignItems='center'
                            paddingTop={ 8 }
                            paddingBottom={ 8 }
                        >
                            <InfoSignIcon color='danger' marginRight={ 8 }/>
                            <Text size={ 300 } color='danger'>{ error.subType }</Text>
                        </Pane>
                    }
                </Pane>
            </form>
        )
    }
}

const formStyles = {
    margin: '0',
    padding: '0',
    display: 'grid',
    gridColumnGap: '10px',
    width: '100%'
}

const reactSelectStyles = {
    container: provided => ({
        ...provided,
        width: '100%'
    }),
    control: provided => ({
        ...provided,
        width: '100%'
    }),
    option: provided => ({
        ...provided,
        textAlign: 'left'
    })
}

ModalForm.propTypes = {
    place: PropTypes.object,
    setModalPlaceData: PropTypes.func.isRequired,
    onConfirmClick: PropTypes.func.isRequired
}

ModalForm.defaultProps = {
    place: null
}

export default ModalForm
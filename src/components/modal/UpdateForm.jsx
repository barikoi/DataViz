import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import ReactSelect from 'react-select'
import { FilePicker } from 'evergreen-ui'
import { isArrayEqual } from '../../utils/arrayUtils'

import './css/UpdateFormStyles.css'

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
const API_AUTH_TOKEN = process.env.REACT_APP_API_AUTH_TOKEN
const P_TYPE_LIST_API_URL = '/place/get/type'

class UpdateForm extends React.PureComponent {
    state = {
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
        pType: [],
        subType: [],
        pTypeList: [],
        subTypeList: [],
        image: []
    }

    componentDidMount() {
        const { autofillData } = this.props
        if(autofillData) {
            const filteredStates = {}
            for(const key in autofillData) {
                if(this.state.hasOwnProperty(key)) {
                    if(key === 'pType' || key === 'subType') {
                        filteredStates[key] = autofillData[key].split(', ')

                    } else {
                        filteredStates[key] = autofillData[key];
                    }
                }
            }

            this.setState({ ...filteredStates });
        }

        // Autofill pType Select
        axios.defaults.baseURL = BASE_API_URL
        axios.defaults.headers = { Authorization: API_AUTH_TOKEN }

        axios.get(P_TYPE_LIST_API_URL)
            .then(results => {
                const pTypeList = results.data.data.map(item => ({ value: item.type, label: item.type }))
                this.setState({ pTypeList })
            })
            .catch(err => console.error(err))
    }

    componentDidUpdate(prevProps, prevState) {
        const { pType } = this.state
        const { autofillData } = this.props

        if(prevProps.autofillData.id !== autofillData.id && autofillData.id) {
            this.setState({
                ...this.state,
                ...autofillData,
                pType: autofillData.pType ? autofillData.pType.split(', ') : [],
                subType: autofillData.subType ? autofillData.subType.split(', ') : []
            })
        }

        // If pType is Empty in State
        if(prevState.pType.length !== pType.length && pType.length === 0) {
            this.setState({ subTypeList: [], subType: [] })
        }

        // If pType is changed and not empty
        if(pType.length !== 0 && !isArrayEqual(prevState.pType, pType)) {
            const fetches = this.state.pType.map(item => (axios.get('/place/sub-type/' + item + '/get')))
            axios.all(fetches)
                .then(results => {
                    let subTypeList = this.state.pType.map(item => ({ label: item, options: [] }))
                    for(let i = 0; i < subTypeList.length; i++) {
                        subTypeList[i].options = results[i].data.data.map(item =>
                            ({ value: item.subtype, label: item.subtype })
                        )
                    }

                    let subType = this.state.subType.filter(sub => subTypeList.map(item => item.options.map(val => val.value)).flat().includes(sub))

                    this.setState({ subTypeList, subType })
                })
                .catch(err => console.error(err))
        }
    }

    handleOnChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleNumberOnChange = event => {
        this.setState({ [event.target.name]: parseInt(event.target.value) })
    }

    handleSubmit = event => {
        event.preventDefault()
        const filteredState = {}
        for (const key in this.state) {
            if(key === 'pTypeList' || key === 'subTypeList') {
                continue

            } else if(key === 'pType' || key === 'subType') {
                filteredState[key] = this.state[key].join(', ')

            } else {
                filteredState[key] = this.state[key]
            }
        }

        this.props.handleFormSubmit(filteredState)
    }

    handlePTypeSelectOnChange = values => {
        if(values) {
            const pType = values.map(item => item.value)
            this.setState({ pType })
        } else {
            this.setState({ pType: [] })
        }
    }

    handleSubTypeSelectOnChange = values => {
        if(values) {
            const subType = values.map(item => item.value)
            this.setState({ subType })
        } else {
            this.setState({ subType: [] })
        }
    }

    handleImageUploadOnChange = files => {
        this.setState({ image: files })
    }

    resetToInitial = () => {
        this.props.resetToInitialProps()
    }

    render() {
        return (
            <div className='form-container'>
                <form className='update-form' onSubmit={ this.handleSubmit }>
                    <div className='form-group' id='name-group'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name' name='business_name' value={ this.state.name } placeholder='Name...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='building-market-group'>
                        <label htmlFor='building-market'>Building/Market</label>
                        <input type='text' id='building-market' name='place_name' value={ this.state.buildingMarket } placeholder='Building/Market...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='holding-group'>
                        <label htmlFor='holding'>Holding</label>
                        <input type='text' id='holding' name='holding_number' value={ this.state.holding } placeholder='Holding...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='road-group'>
                        <label htmlFor='road'>Road</label>
                        <input type='text' id='road' name='road_name_number' value={ this.state.road } placeholder='Road...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='super-sub-area-group'>
                        <label htmlFor='super-sub-area'>Super Sub-area</label>
                        <input type='text' id='super-sub-area' name='super_sub_area' value={ this.state.superSubArea } placeholder='Super Sub-area...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='sub-area-group'>
                        <label htmlFor='sub-area'>Sub-area</label>
                        <input type='text' id='sub-area' name='sub_area' value={ this.state.subArea } placeholder='Sub-area...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='area-group'>
                        <label htmlFor='area'>Area</label>
                        <input type='text' id='area' name='area' value={ this.state.area } placeholder='Area...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='city-group'>
                        <label htmlFor='city'>City</label>
                        <input type='text' id='city' name='city' value={ this.state.city } placeholder='City...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='post-code-group'>
                        <label htmlFor='post-code'>Post Code</label>
                        <input type='text' id='post-code' name='postCode' value={ this.state.postCode } placeholder='Post Code...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='thana-group'>
                        <label htmlFor='thana'>Thana</label>
                        <input type='text' id='thana' name='thana' value={ this.state.thana } placeholder='Thana...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='district-group'>
                        <label htmlFor='district'>District</label>
                        <input type='text' id='district' name='district' value={ this.state.district } placeholder='District...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='sub-district-group'>
                        <label htmlFor='sub-district'>Sub District</label>
                        <input type='text' id='sub-district' name='sub_district' value={ this.state.subDistrict } placeholder='Sub District' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='union-group'>
                        <label htmlFor='union'>Union</label>
                        <input type='text' id='union' name='unions' value={ this.state.union } placeholder='Union...' onChange={ this.handleOnChange } />
                    </div>

                    <div className='form-group' id='popularity-ranking-group'>
                        <label htmlFor='popularity-ranking'>Popularity Ranking</label>
                        <input type='number' id='popularity-ranking' name='popularity_ranking' value={ this.state.popularityRanking } placeholder='Popularity Ranking...' onChange={ this.handleNumberOnChange } />
                    </div>

                    <div className='form-group' id='upload-images-group'>
                        <label>Upload Images</label>
                        <FilePicker
                            name='image'
                            accept='.jpg, .JPG, .png, .PNG'
                            multiple={ true }
                            onChange={ this.handleImageUploadOnChange }
                        />
                    </div>

                    <div className='form-group' id='ptype-group'>
                        <label htmlFor='pType'>Primary Type</label>
                        <ReactSelect
                            id='pType'
                            options={ this.state.pTypeList }
                            value={ this.state.pTypeList.filter(item => this.state.pType.includes(item.value)) }
                            styles={ selectStyles }
                            isMulti={ true }
                            closeMenuOnSelect={ false }
                            onChange={ this.handlePTypeSelectOnChange }
                            menuShouldScrollIntoView={ true }
                        />
                    </div>

                    <div className='form-group' id='subtype-group'>
                        <label htmlFor='subType'>Sub Type</label>
                        <ReactSelect
                            id='subType'
                            options={ this.state.subTypeList }
                            value={ this.state.subTypeList.map(listItem => (
                                    listItem.options.filter(item => this.state.subType.includes(item.value))
                                )).flat() 
                            }
                            styles={ selectStyles }
                            isMulti={ true }
                            closeMenuOnSelect={ false }
                            onChange={ this.handleSubTypeSelectOnChange }
                            menuShouldScrollIntoView={ true }
                        />
                    </div>
                    <button className='reset-modal' type='reset' onClick={ this.resetToInitial }>Reset</button>
                    <button type='submit'>Save Changes</button>
                </form>
            </div>
        )
    }
}

const selectStyles = {
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

UpdateForm.defaultProps = {
    autofillData: null
}

UpdateForm.propTypes = {
    handleFormSubmit: PropTypes.func.isRequired,
    autofillData: PropTypes.object,
    resetToInitialProps: PropTypes.func
}

export default UpdateForm
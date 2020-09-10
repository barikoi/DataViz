import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import './css/UpdateFormStyles.css'

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
const API_AUTH_TOKEN = process.env.REACT_APP_API_AUTH_TOKEN
const P_TYPE_LIST_API_URL = '/place/get/type'
let SUB_TYPE_LIST_API_URL = '/place/sub-type/'

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
        pType: '',
        subType: '',
        pTypeList: [],
        subTypeList: [],
    }

    componentDidMount() {
        const { autofillData } = this.props
        if(autofillData) {
            const filteredStates = {}
            for(const key in autofillData) {
                if(this.state.hasOwnProperty(key)) {
                    filteredStates[key] = autofillData[key];
                }
            }

            this.setState({ ...filteredStates });
        }

        // Autofill pType Select
        axios.defaults.baseURL = BASE_API_URL
        axios.defaults.headers = { Authorization: API_AUTH_TOKEN }

        axios.get(P_TYPE_LIST_API_URL)
            .then(results => {
                const pTypeList = results.data.data.map(item => item.type)
                this.setState({ pTypeList })
            })
            .catch(err => console.error(err))
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.pType !== this.state.pType && this.state.pType !== '') {
            SUB_TYPE_LIST_API_URL = '/place/sub-type/' + this.state.pType + '/get'
            axios.get(SUB_TYPE_LIST_API_URL)
                .then(results => {
                    const subTypeList = results.data.data.map(item => item.subtype)
                    this.setState({ subTypeList })
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
            } else {
                filteredState[key] = this.state[key]
            }
        }

        this.props.handleFormSubmit(filteredState)
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

                    <div className='form-group' id='ptype-group'>
                        <label htmlFor='ptype'>Primary Type</label>
                        <select id='ptype' name='pType' value={ this.state.pType } onChange={ this.handleOnChange } required={ true }>
                            <option value=''>--Select Primary Type--</option>
                            { this.state.pTypeList.map((item, index) => <option key={ index } value={ item }>{ item }</option>) }
                        </select>
                    </div>

                    <div className='form-group' id='subtype-group'>
                        <label htmlFor='subtype'>Sub Type</label>
                        <select id='subtype' name='subType' value={ this.state.subType } onChange={ this.handleOnChange } required={ true }>
                            <option value=''>--Select Sub Type--</option>
                            { this.state.subTypeList.map((item, index) => <option key={ index } value={ item }>{ item }</option>) }
                        </select>
                    </div>
                    <button type='submit'>Save Changes</button>
                </form>
            </div>
        )
    }
}

UpdateForm.propTypes = {
    handleFormSubmit: PropTypes.func.isRequired,
    autofillData: PropTypes.object
}

export default UpdateForm
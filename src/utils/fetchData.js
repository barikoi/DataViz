import axios from 'axios'

const API_AUTH_TOKEN = process.env.REACT_APP_API_AUTH_TOKEN
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
const P_TYPE_LIST_API_URL = '/place/get/type'
const SEARCH_API_URL = '/search/autocomplete/admin'

// Set Axios Base API Url and Authorization Headers
axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers = { Authorization: API_AUTH_TOKEN };

// Fetch pTypeList from API
export function fetchPTypeList() {
    return axios.get(P_TYPE_LIST_API_URL)
        .then(results => {
            if(!results.data.data || results.data.data.length === 0) {
                return []
            }

            const pTypeList = results.data.data.map(item =>
                ({ label: item.type.trim(), value: item.type.trim().toLowerCase() })
            )

            return pTypeList
        })
        .catch(err => { throw(err) })
}

// Fetch subTypeList based on given pType
export function fetchSubTypeListForPType(pType, subType) {
    const fetches = pType.split(',').map(val => val.trim()).map(item => (axios.get('/place/sub-type/' + item + '/get')))

    return axios.all(fetches)
        .then(res => {
            const subTypeList = res.map(item => item.data.data).filter(arr => arr.length > 0)
                .map(val => ({
                    label: val[0].type,
                    options: val.map(el => ({ label: el.subtype, value: el.subtype.trim().toLowerCase() }))
                }))
            
            // Remove subType if its parent pType is removed
            const allSubTypes = subTypeList.map(item => item.options.map(val => val.value)).flat()
            const subTypeArray = subType.split(',').map(val => val.trim())
            const refinedSubType = subTypeArray.filter(item => allSubTypes.includes(item.toLowerCase())).join(', ')
            const newSubType = subTypeArray.filter(item => !allSubTypes.includes(item.toLowerCase())).join(', ')

            return { subTypeList, refinedSubType, newSubType }
        })
        .catch(err => { throw(err) })
}

// Fetch Search Autocomplete List
export function fetchSearchAutocompleteList(searchInput) {
    return axios.get(SEARCH_API_URL, { params: { search: searchInput } })
        .then(res => {
            const autoCompleteList = res.data.places
            return autoCompleteList
        })
        .catch(err => { throw(err) })
}
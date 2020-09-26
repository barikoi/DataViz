import axios from 'axios'

const API_AUTH_TOKEN = process.env.REACT_APP_API_AUTH_TOKEN
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
const REVERSE_GEO_API_URL = '/reverse/without/auth'

// Set Axios Base API Url and Authorization Headers
axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers = { Authorization: API_AUTH_TOKEN };

export function latLongValidator(latitude, longitude) {
    // Check Lat-Long Validity
    return new Promise(resolve => {
        let error = {}
        if(latitude > 90 || latitude < -90) {
            error.message = 'Latitude must be between -90 and 90'
        }
        
        if(longitude > 180 || longitude < -180) {
            error.message = 'Longitude must be between -180 and 180'
        }
        
        resolve({ error })

    })
    .then(res => {
        if(res.error.message) {
            return res

        } else {
            return axios.get(REVERSE_GEO_API_URL, { params: { latitude, longitude } })
                .then(results => {
                    if(!results.data[0]) {
                        res.error = results.data

                    } else {
                        res.data = results.data[0]
                        delete res.data.uCode
                    }

                    return res

                })
                .catch(err => { throw(err) })
        }
    })
    .catch(err => { throw(err) })
}
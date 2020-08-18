import axios from 'axios';

// Data API
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const CTG_API_URL = '/chittagong';
const SYLHET_API_URL = '/sylhet';

// Fetch API Data
export function fetchAPIData() {
    // Set Axios Base API Url
    axios.defaults.baseURL = BASE_API_URL;

    return axios.all([
        axios.get(CTG_API_URL),
        axios.get(SYLHET_API_URL)
    ])
    .then(axios.spread((result1, result2) => {
        return {
            ctgData: result1.data.data,
            sylhetData: result2.data.data
        };
    }))
    .catch(err => {
        console.error(err);
    });
}
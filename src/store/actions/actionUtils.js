import axios from 'axios';

// Data API
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_AUTH_TOKEN = process.env.REACT_APP_API_AUTH_TOKEN;
const BIRDS_EYE_DATA_API_URL = '/place/get';
const VAULT_DATA_API_URL = '/get/vault/all/data';

// Fetch Data From API function
export function fetchDataFromAPI() {
    // Set Axios Base API Url and Authorization Headers
    axios.defaults.baseURL = BASE_API_URL;
    axios.defaults.headers = { Authorization: API_AUTH_TOKEN };

    // Build API Date params
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const dateTill = tomorrow.toISOString().slice(0, 10);
    
    // Set month to 1 month ago and time to zero hours and so on
    tomorrow.setMonth(tomorrow.getMonth()-1);
    tomorrow.setHours(0, 0, 0, 0);
    const dateFrom = tomorrow.toISOString().slice(0, 10);

    // Birds Eye Data API returns data for current date only if no param passed
    const birdsEyeDataParams = { dateFrom, dateTill };

    // Vault Data API returns All Data if no param passed 
    const vaultDataParams = { dateFrom, dateTill };

    return axios.all([
        axios.get(BIRDS_EYE_DATA_API_URL, { params: { dateFrom: '2020-10-12', dateTill: '2020-10-13' } }),
        axios.get(VAULT_DATA_API_URL)
    ])
    .then(axios.spread((result1, result2) => {
        // Parse user_id to string
        result1.data.Message = parseFieldsToString(result1.data.Message);
        result2.data.Data = parseFieldsToString(result2.data.Data);

        return {
            birdsEyeData: result1.data.Message || {},
            vaultData: result2.data.Data || {}
        };
    }))
    .catch(err => {
        console.error(err);
    });
}

// Parse user_id column to strings and add created_date as String
function parseFieldsToString(data) {
    data.forEach(item => {
        item.user_id = 'U-' + item.user_id;
        item.created_date = 'Date-' + item.created_at.slice(0, 10);
    });

    return data;
}
import { wrapTo, updateMap } from 'kepler.gl/actions'

// Set Map Zoom, Latitude and Longitude based on Search Item
export function highlightPlaceOnSearch(selectedPlace) {
    return (dispatch, getState) => {
        // console.log('Search Item:', selectedPlace)
        const zoom = 18.044980988791917
        const { latitude, longitude } = selectedPlace

        // Search in Current Layer Data
        const { layerData } = getState().keplerGl.map.visState
        let searchResult = null
        layerData.forEach(layer => {
            searchResult = layer.data.find(item => item.data[0] === selectedPlace.id)
            // console.log('Inside Loop')
        })

        // console.log('Search Result:', searchResult)
    }
}
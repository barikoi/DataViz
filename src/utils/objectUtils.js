// Replace Keys of Null value with empty string
export function replaceNullKeys(obj) {
    let res = {}
    Object.keys(obj).forEach(key => {
        if(key !== 'image' && obj[key] === null) {
            res[key] = ''
        } else {
            res[key] = obj[key]
        }
    })

    return res
}

// Filter Place prop to keep only keys that are in state and update with prop place values
export function filterPlaceProp(props, state, skipKeys=null) {
    let filteredProps = {}
    Object.keys(props).forEach(key => {
        if(Object.keys(state).includes(key)) {
            let value = props[key]
            if(props[key] === null) {
                value = ''
            }

            const type = typeof props[key]
            if(type === 'string' || type === 'String' || type === 'STRING') {
                value = value.trim()
            }

            // If SkipKeys are provided
            if(skipKeys) {
                if(skipKeys.includes(key)) {
                    return
                }
            }

            filteredProps[key] = value
        }
    })

    return filteredProps
}

// Find New SubType if exists any
export function findNewSubType(subTypeList, subType) {
    const allSubTypes = subTypeList.map(item => item.options.map(val => val.value)).flat()
    const subTypeArray = subType.split(',').map(val => val.trim())
    const newSubType = subTypeArray.filter(item => !allSubTypes.includes(item.toLowerCase())).join(', ')
    
    return newSubType
}
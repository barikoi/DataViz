export function isArrayEqual(array1, array2) {
    // If length not same
    if(array1.length !== array2.length) {
        return false
    }

    // Compare elements
    let flag = true
    array1.forEach(item => {
        if(!array2.includes(item)) {
            flag = false
        }
    })

    return flag
}
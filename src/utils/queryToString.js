export default function (query) {
    let result = ''
    for (const queryElement in query) {
        result += `${queryElement}=${query[queryElement]}&`
    }
    result = result.slice(0, -1)
    return result
}

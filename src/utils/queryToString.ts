export default function (query: any) {
    let result: string = ''
    for (const queryElement in query) {
        result += `${queryElement}=${query[queryElement]}&`
    }
    result = result.slice(0, -1)
    return result
}

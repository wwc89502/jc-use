import queryToString from './utils/queryToString';
import stringToPath from './utils/stringToPath';
import { globalConfig } from './globalConfig';

/**
 * @description 设置请求头
 * @param headers
 */
const setFetchHeaders = (headers: object) => {
    globalConfig.setData({
        fetchHeaders: headers
    })
}

interface ObjectAny {
    [key: string]: any
}
/**
 * @description 使用fetch进行异步请求
 * @usage api.apiString([$,] config: {})
 */
export function useFetch () {
    return new Proxy({
        setFetchHeaders
    }, {
        get (target: any, prop: string) {
            const { baseURL, fetchHeaders, apiDict } = globalConfig.value
            const { method, path } = stringToPath(prop)
            if (!!target[prop]) {
                return (...args: any[]) => {
                    target[prop](...args)
                }
            } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                return (...args: any[]) => {
                    const argsShift = args.shift()
                    const url = path.replace(/\$/g, () => argsShift)
                    const options: ObjectAny = argsShift || {}
                    let queryString = ''
                    method === 'get' && (queryString = '?' + queryToString(options.params))
                    method === 'post' && !options.body && (options.body = JSON.stringify(options.data))
                    function _fetch () {
                        return new Promise((resolve: any, reject: any) => {
                            fetch(`${baseURL}${url}${queryString}`, {
                                method,
                                ...options,
                                headers: {
                                    ...fetchHeaders,
                                    ...options.headers
                                }
                            })
                                .then((res: Response) => {
                                    if ([200].includes(res.status)) {
                                        resolve(res.json())
                                    } else {
                                        reject(res.json())
                                    }
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        })
                    }
                    return new Promise((resolve: any, reject: any) => {
                        _fetch().then((res: any) => {
                            const successCodes: any[] = apiDict.successCodes
                            if (successCodes.includes(res[apiDict.code])) {
                                if (res[apiDict.data]) {
                                    resolve(res[apiDict.data])
                                } else {
                                    resolve(res)
                                }
                            } else {
                                res[apiDict.message] && apiDict.errorMsgHandle(res[apiDict.message])
                                reject(res)
                            }
                        }).catch(err => {
                            reject(err)
                        })
                    })
                }
            } else {
                return false
            }
        }
    })
}

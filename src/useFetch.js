import queryToString from './utils/queryToString';
import stringToPath from './utils/stringToPath';
import { globalConfig } from './globalConfig';

/**
 * @description 设置请求头
 * @param headers
 */
const setHeaders = (headers) => {
    globalConfig._extend({
        fetchHeaders: headers
    })
}

/**
 * @description 使用fetch进行异步请求
 * @returns {(function(...[*]): Promise<unknown>)|(function(...[*]): void)|*|{setHeaders: setHeaders}}
 * @example
 *
 * $ 替换path中的参数
 * api.getUsers$Books(1, { params: { page: 1, size: 10 })
 * => GET /users/1/books config
 *
 * $$ 保持path中驼峰命名单词不全被替换为小写
 * api.getUsersGroup$$Query({ params: { page: 1, size: 10 })
 * => GET /users/groupQuery config
 *
 * api.postUsers({ data: { name: 'jc', age: 18 } })
 * => POST /users config
 */
export function useFetch () {
    return new Proxy({
        setHeaders
    }, {
        get (target, prop) {
            const { baseURL = '', fetchHeaders = {}, apiDict = {} } = globalConfig.config
            const { method, path } = stringToPath(prop)
            if (!!target[prop]) {
                return (...args) => {
                    target[prop](...args)
                }
            } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                return (...args) => {
                    const url = path.replace(/\$/g, () => args.shift())
                    const options = args.shift() || {}
                    let queryString = ''
                    method === 'get' && (queryString = '?' + queryToString(options.params))
                    method === 'post' && !options.body && (options.body = JSON.stringify(options.data))
                    function _fetch () {
                        return new Promise((resolve, reject) => {
                            fetch(`${baseURL}${url}${queryString}`, {
                                method,
                                ...options,
                                headers: {
                                    ...fetchHeaders,
                                    ...options.headers
                                }
                            })
                                .then(res => {
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
                    return new Promise((resolve, reject) => {
                        _fetch().then(res => {
                            if (apiDict.successCodes.includes(res[apiDict.code])) {
                                resolve(res[apiDict.data])
                            } else {
                                apiDict.errorMsgHandle(res[apiDict.message])
                                reject(res)
                            }
                        }).catch(err => {
                            reject(err)
                        })
                    })
                }
            }
        }
    })
}

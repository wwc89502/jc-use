import queryToString from './utils/queryToString';
import stringToPath from './utils/stringToPath';
import { globalConfig } from './globalConfig';

/**
 * @description 使用fetch进行异步请求
 * @returns {(function(...[*]): Promise<unknown>)|(function(...[*]): void)|*|{}}
 * @example
 *
 * 设置请求头
 * api.setHeaders({})
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
    const setHeaders = (headers) => {
        globalConfig._extend({
            fetchHeaders: headers
        })
    }
    return new Proxy({}, {
        get (target, prop) {
            const { baseURL = '', fetchHeaders } = globalConfig.config
            const { method, path } = stringToPath(prop)
            const extendHandle = {
                setHeaders
            }
            if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                return (...args) => {
                    const url = path.replace(/\$/g, () => args.shift())
                    const options = args.shift() || {}
                    let queryString = ''
                    method === 'get' && (queryString = '?' + queryToString(options.params))
                    method === 'post' && !options.body && (options.body = JSON.stringify(options.data))
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
                                    reject(res)
                                }
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
                }
            } else if (extendHandle[prop]) {
                return (...args) => {
                    extendHandle[prop](...args)
                }
            }
        }
    })
}

import axios from 'axios'
import stringToPath from './utils/stringToPath';
import { globalConfig } from './globalConfig';

/**
 * @description 设置请求头
 * @param headers
 */
const setHeaders = (headers: object) => {
    globalConfig._extend({
        axiosHeaders: headers
    })
}

interface Options {
    [key: string]: any
}
/**
 * @description 使用axios进行异步请求
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
export function useAxios () {
    return new Proxy({
        setHeaders
    }, {
        get (target: any, prop: string) {
            const { baseURL = '', axiosHeaders = {}, apiDict = {} } = globalConfig.config
            const { method, path } = stringToPath(prop)
            if (!!target[prop]) {
                return (...args: any[]) => {
                    target[prop](...args)
                }
            } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                return (...args: any[]) => {
                    const argsShift = args.shift()
                    const url = path.replace(/\$/g, () => argsShift)
                    const options: Options = argsShift || {}
                    return new Promise((resolve: any, reject: any) => {
                        const config: Options = {
                            baseURL,
                            method,
                            url,
                            ...options,
                            headers: {
                                ...axiosHeaders,
                                ...options.headers
                            }
                        }
                        axios(config).then(res => {
                            if ([200].includes(res.status)) {
                                const resData = res.data
                                if (apiDict.successCodes.includes(resData[apiDict.code])) {
                                    if (resData[apiDict.data]) {
                                        resolve(resData[apiDict.data])
                                    } else {
                                        resolve(resData)
                                    }
                                } else {
                                    resData[apiDict.message] && apiDict.errorMsgHandle(resData[apiDict.message])
                                    reject(resData)
                                }
                            } else {
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

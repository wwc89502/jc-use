"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAxios = void 0;
const axios_1 = require("axios");
const stringToPath_1 = require("./utils/stringToPath");
const globalConfig_1 = require("./globalConfig");
/**
 * @description 设置请求头
 * @param headers
 */
const setHeaders = (headers) => {
    globalConfig_1.globalConfig._extend({
        axiosHeaders: headers
    });
};
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
function useAxios() {
    return new Proxy({
        setHeaders
    }, {
        get(target, prop) {
            const { baseURL = '', axiosHeaders = {}, apiDict = {} } = globalConfig_1.globalConfig.config;
            const { method, path } = (0, stringToPath_1.default)(prop);
            if (!!target[prop]) {
                return (...args) => {
                    target[prop](...args);
                };
            }
            else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                return (...args) => {
                    const argsShift = args.shift();
                    const url = path.replace(/\$/g, () => argsShift);
                    const options = argsShift || {};
                    return new Promise((resolve, reject) => {
                        const config = {
                            baseURL,
                            method,
                            url,
                            ...options,
                            headers: {
                                ...axiosHeaders,
                                ...options.headers
                            }
                        };
                        (0, axios_1.default)(config).then(res => {
                            if ([200].includes(res.status)) {
                                const resData = res.data;
                                if (apiDict.successCodes.includes(resData[apiDict.code])) {
                                    if (resData[apiDict.data]) {
                                        resolve(resData[apiDict.data]);
                                    }
                                    else {
                                        resolve(resData);
                                    }
                                }
                                else {
                                    resData[apiDict.message] && apiDict.errorMsgHandle(resData[apiDict.message]);
                                    reject(resData);
                                }
                            }
                            else {
                                reject(res);
                            }
                        }).catch(err => {
                            reject(err);
                        });
                    });
                };
            }
            else {
                return false;
            }
        }
    });
}
exports.useAxios = useAxios;

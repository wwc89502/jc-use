interface GlobalConfig {
    setData: (config: any) => void,
    value: {
        baseURL: string,
        apiDict: {
            code: string,
            successCodes: number[] | string[],
            data: string,
            message: string,
            errorMsgHandle: any
        },
        [key: string]: any
    }
}
const apiDict = {
    code: 'code', // 接口返回的状态码的字段名
    successCodes: [200], // 接口请求成功的状态码集合
    data: 'data', // 接口返回数据的字段名
    message: 'msg', // 接口返回报错信息的字段名
    // 请求失败时的回调
    errorMsgHandle: (msg: string) => {
        console.error(msg)
    }
}
export const globalConfig: GlobalConfig = new Proxy({
    value: {
        baseURL: '',
        axiosHeaders: {},
        fetchHeaders: {},
        apiDict
    },
    setData: (config: any) => {
        for (const valueKey in config) {
            if (Object.prototype.toString.call(config[valueKey]) === '[object Object]') {
                globalConfig.value[valueKey] = {
                    ...globalConfig.value[valueKey],
                    ...config[valueKey]
                }
            } else {
                globalConfig.value[valueKey] = config[valueKey]
            }
        }
    }
}, {})

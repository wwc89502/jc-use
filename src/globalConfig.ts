interface ApiDict {
    code: string,
    successCodes: number[] | string[],
    data: string,
    message: string,
    errorMsgHandle: any
}
const apiDict: ApiDict = {
    code: 'code',
    successCodes: [200],
    data: 'data',
    message: 'msg',
    errorMsgHandle: (msg: string) => {
        console.error(msg)
    }
}
export const globalConfig: any = new Proxy({
    value: {
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

interface Config {
    apiDict: object,
    [key: string]: any
}
const defaultConfig: Config = {
    apiDict: {
        code: 'code',
        successCodes: [200],
        data: 'data',
        message: 'msg',
        errorMsgHandle: (msg: string) => {
            console.error(msg)
        }
    }
}
class GlobalConfig {
    public config: {
        [key: string]: any
    };
    constructor() {
        this.config = {
            ...defaultConfig
        }
    }
    public _get(key: string) {
        return this.config[key]
    }
    public _set(key: string, value: any) {
        this.config[key] = value
    }
    public _extend(extendConfig: object) {
        this.config = {
            ...this.config,
            ...extendConfig
        }
    }
}

export const globalConfig = new GlobalConfig()

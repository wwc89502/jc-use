const defaultConfig = {
    apiDict: {
        code: 'code',
        successCodes: [200],
        data: 'data',
        message: 'msg',
        errorMsgHandle: (msg) => {
            console.error(msg)
        }
    }
}
class GlobalConfig {
    constructor() {
        this.config = {
            ...defaultConfig
        }
    }
    _get(key) {
        return this.config[key]
    }
    _set(key, value) {
        this.config[key] = value
    }
    _extend(extendConfig) {
        this.config = {
            ...this.config,
            ...extendConfig
        }
    }
}

export const globalConfig = new GlobalConfig()

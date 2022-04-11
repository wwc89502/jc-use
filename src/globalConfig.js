class GlobalConfig {
    constructor() {
        this.config = {}
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

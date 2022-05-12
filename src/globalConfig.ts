export interface ApiDict {
  code: string;
  data: string;
  message: string;
}
export interface GlobalConfig {
  baseURL: string;
  axiosHeaders: ProxyHandler<object>;
  fetchHeaders: ProxyHandler<object>;
  withCredentials: boolean;
  successCodes: (number | string)[];
  noAllowCodes: (number | string)[];
  requestTimeout: number;
  apiDict: ApiDict;
  errorMsgHandle(msg: string, status: number | string): void;
  noAllowHandle(msg: string): void;
  [key: string]: any;
}

const apiDict: ApiDict = {
  code: 'code', // 接口返回的状态码的字段名
  data: 'data', // 接口返回数据的字段名
  message: 'msg', // 接口返回报错信息的字段名
};
const globalConfigValue: GlobalConfig = Object.preventExtensions({
  baseURL: '', // 基础路径
  axiosHeaders: freezyObj({}), // useAxios 请求头
  fetchHeaders: freezyObj({}), // useFetch 请求头
  withCredentials: false, // 指示是否应使用凭据进行跨站点访问控制请求
  successCodes: [200], // 接口请求成功的状态码集合
  noAllowCodes: [401], // 无接口请求权限的状态码集合
  requestTimeout: 30000, // 接口超时时间
  apiDict: apiDict, // 接口返回的数据对应字段的字典
  // 请求失败时的回调
  errorMsgHandle: (msg: string, status: number | string) => {
    console.error(msg, status);
  },
  // 无接口请求权限时的回调
  noAllowHandle: (msg: string) => {
    console.error(msg);
  },
});
function freezyObj(obj: {}): ProxyHandler<object> {
  return new Proxy(obj, {
    set<T extends object, K extends keyof T>(target: T, p: K): boolean {
      const oldVal = target[p];
      console.error(`${p}修改失败，请使用globalConfig.setData()修改配置`);
      return Reflect.set(target, p, oldVal);
    },
  });
}
/**
 * @description 设置 globalConfig
 * @param config
 */
const setData = <T extends GlobalConfig, K extends keyof T>(config: T) => {
  for (const valueKey in config) {
    if (Object.prototype.toString.call(config[valueKey]) === '[object Object]') {
      globalConfigValue[valueKey] = freezyObj({
        ...globalConfigValue[valueKey],
        ...config[valueKey],
      });
    } else {
      globalConfigValue[valueKey] = config[valueKey];
    }
  }
};
export const globalConfig: GlobalConfig = new Proxy(globalConfigValue, {
  get(target: GlobalConfig, p: string): (config: GlobalConfig) => void {
    if (p === 'setData') {
      return (config: GlobalConfig): void => {
        setData(config);
      };
    } else {
      return Reflect.get(target, p);
    }
  },
  set(target: GlobalConfig, p: string): boolean {
    const oldVal = target[p];
    console.error(`${p}修改失败，请使用globalConfig.setData()修改配置`);
    return Reflect.set(target, p, oldVal);
  },
});

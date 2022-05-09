interface GlobalConfig {
  baseURL: string;
  axiosHeaders: object;
  fetchHeaders: object;
  withCredentials: boolean;
  successCodes: any[];
  noAllowCodes: any[];
  requestTimeout: number;
  apiDict: any;
  errorMsgHandle: any;
  noAllowHandle: any;
  [key: string]: any;
}

const globalConfigValue: GlobalConfig = Object.preventExtensions({
  baseURL: '',
  axiosHeaders: freezyObj({}),
  fetchHeaders: freezyObj({}),
  withCredentials: false, // 指示是否应使用凭据进行跨站点访问控制请求
  successCodes: [200], // 接口请求成功的状态码集合
  noAllowCodes: [401], // 无接口请求权限的状态码集合
  requestTimeout: 30000, // 接口超时时间
  apiDict: freezyObj({
    code: 'code', // 接口返回的状态码的字段名
    data: 'data', // 接口返回数据的字段名
    message: 'msg', // 接口返回报错信息的字段名
  }),
  // 请求失败时的回调
  errorMsgHandle: (msg: string, status: number | string) => {
    console.error(msg, status);
  },
  // 无接口请求权限时的回调
  noAllowHandle: (msg: string) => {
    console.error(msg);
  },
});
function freezyObj(obj: object) {
  return new Proxy(obj, {
    set(target: GlobalConfig, p: string): any {
      const oldVal = target[p];
      console.error(`${p}修改失败，请使用globalConfig.setData()修改配置`);
      return Reflect.set(target, p, oldVal);
    },
  });
}
const setData = (config: any) => {
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
export const globalConfig = new Proxy(globalConfigValue, {
  get(target: GlobalConfig, p: string): any {
    if (p === 'setData') {
      return (config: object) => {
        setData(config);
      };
    } else {
      return Reflect.get(target, p);
    }
  },
  set(target: GlobalConfig, p: string): any {
    const oldVal = target[p];
    console.error(`${p}修改失败，请使用globalConfig.setData()修改配置`);
    return Reflect.set(target, p, oldVal);
  },
});

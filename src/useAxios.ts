import axios, { AxiosError, AxiosResponse } from "axios";
import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { globalConfig } from './globalConfig';
// @ts-ignore
import qs from 'qs';

/**
 * @description 设置请求头
 * @param headers
 */
const setAxiosHeaders = (headers: object) => {
  globalConfig.setData({
    axiosHeaders: headers,
  });
};

interface ObjectAny {
  [key: string]: any;
}
/**
 * @description 使用axios进行异步请求
 * @usage api.apiString([$,] config: {})
 */
export function useAxios() {
  return new Proxy(
    {
      setAxiosHeaders,
    },
    {
      get(target: any, prop: string) {
        const { baseURL, axiosHeaders, apiDict } = globalConfig;
        const { method, path } = stringToPath(prop);
        if (!!target[prop]) {
          return (...args: any[]) => {
            target[prop](...args);
          };
        } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          return (...args: any[]) => {
            const url = path.replace(/\$/g, () => args[0]);
            const options: ObjectAny = url === path ? args[0] || {} : args[1] || {};
            if (['post', 'put', 'patch', 'delete'].includes(method) && options.useForm) {
              options.data = qs.stringify(options.data);
            }
            options.timeout = options.timeout || 30000
            return new Promise((resolve: any, reject: any) => {
              let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
              if (!options.useForm) contentTypeHeaders = {}
              const config: ObjectAny = {
                baseURL,
                method,
                url,
                ...options,
                headers: {
                  ...contentTypeHeaders,
                  ...axiosHeaders,
                  ...options.headers,
                },
              };
              axios(config)
                .then((res: AxiosResponse) => {
                  if ([200].includes(res.status)) {
                    const resData = res.data;
                    promiseData(resData, resolve, reject);
                  } else {
                    reject(res);
                  }
                })
                .catch((err: AxiosError) => {
                  const error: any = err.toJSON()
                  if (!apiDict.noAllowCodes.includes(error.status)) apiDict.errorMsgHandle(error.message || `接口错误 ${error.status}`, error.status);
                  else apiDict.noAllowHandle(error.message || `接口错误 ${error.status}`)
                  reject({
                    message: error.message,
                    status: error.status
                  });
                });
            });
          };
        } else {
          return false;
        }
      },
    },
  );
}

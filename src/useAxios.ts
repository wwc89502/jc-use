import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { GlobalConfig, globalConfig } from './globalConfig';
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
      get<T extends ObjectAny, K extends keyof T>(target: T, prop: K) {
        const {
          baseURL,
          axiosHeaders,
          noAllowCodes,
          requestTimeout,
          errorMsgHandle,
          noAllowHandle,
          withCredentials,
        }: GlobalConfig = globalConfig;
        const { method, path } = stringToPath(prop as string);
        if (target.hasOwnProperty(prop) && typeof target[prop] === 'function') {
          return (...args: any[]) => {
            target[prop](...args);
          };
        } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          return (...args: any[]) => {
            const url: string = path.replace(/\$/g, () => args[0]);
            const options: ObjectAny = url === path ? args[0] || {} : args[1] || {};
            if (['post', 'put', 'patch', 'delete'].includes(method) && options.useForm) {
              options.data = qs.stringify(options.data);
            }
            let timeout: number = options.timeout || requestTimeout;
            if (isNaN(timeout)) {
              timeout = 30000;
              console.warn('timeout should be a number type, has been changed to 30000!');
            }
            return new Promise((resolve: (cb: any) => void, reject: (cb: any) => void): void => {
              let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
              if (!options.useForm) contentTypeHeaders = {};
              const config: AxiosRequestConfig = {
                method: method as Method,
                url,
                ...options,
                baseURL: options.baseURL || baseURL,
                timeout,
                withCredentials: options.withCredentials || withCredentials,
                headers: {
                  ...contentTypeHeaders,
                  ...axiosHeaders,
                  ...options.headers,
                },
              };
              axios(config)
                .then((response: AxiosResponse) => response.data)
                .then((resData) => {
                  promiseData(resData, resolve, reject);
                })
                .catch((err: AxiosError) => {
                  const error: any = err.toJSON();
                  if (!noAllowCodes.includes(error.status))
                    errorMsgHandle(error.message || `接口错误 ${error.status}`, error.status || '');
                  else noAllowHandle(error.message || `接口错误 ${error.status}`);
                  reject({
                    message: error.message,
                    status: error.status,
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

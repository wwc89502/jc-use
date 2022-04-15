import axios, { AxiosResponse } from 'axios';
import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { globalConfig } from './globalConfig';

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
        const { baseURL, axiosHeaders } = globalConfig;
        const { method, path } = stringToPath(prop);
        if (!!target[prop]) {
          return (...args: any[]) => {
            target[prop](...args);
          };
        } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          return (...args: any[]) => {
            const argsShift = args.shift();
            const url = path.replace(/\$/g, () => argsShift);
            const options: ObjectAny = argsShift || {};
            return new Promise((resolve: any, reject: any) => {
              const config: ObjectAny = {
                baseURL,
                method,
                url,
                ...options,
                headers: {
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
                .catch((err) => {
                  reject(err);
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

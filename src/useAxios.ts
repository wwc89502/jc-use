import axios, { AxiosResponse } from 'axios';
import stringToPath from './utils/stringToPath';
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
        const { baseURL, axiosHeaders, apiDict } = globalConfig.value;
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
                    const successCodes: any[] = apiDict.successCodes;
                    if (successCodes.includes(resData[apiDict.code])) {
                      if (resData[apiDict.data]) {
                        resolve(resData[apiDict.data]);
                      } else {
                        resolve(resData);
                      }
                    } else {
                      const msg: string = resData[apiDict.message];
                      if (msg) apiDict.errorMsgHandle(msg);
                      reject(resData);
                    }
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

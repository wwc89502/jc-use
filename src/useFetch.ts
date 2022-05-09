import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { globalConfig } from './globalConfig';
// @ts-ignore
import qs from 'qs';

/**
 * @description 设置请求头
 * @param headers
 */
const setFetchHeaders = (headers: object) => {
  globalConfig.setData({
    fetchHeaders: headers,
  });
};

interface ObjectAny {
  [key: string]: any;
}
/**
 * @description 使用fetch进行异步请求
 * @usage api.apiString([$,] config: {})
 */
export function useFetch() {
  return new Proxy(
    {
      setFetchHeaders,
    },
    {
      get(target: any, prop: string) {
        const { baseURL, fetchHeaders, apiDict, noAllowCodes, requestTimeout, errorMsgHandle, noAllowHandle, withCredentials } =
          globalConfig;
        const { method, path } = stringToPath(prop);
        if (!!target[prop]) {
          return (...args: any[]) => {
            target[prop](...args);
          };
        } else if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          return (...args: any[]) => {
            const url = path.replace(/\$/g, () => args[0]);
            const options: ObjectAny = url === path ? args[0] || {} : args[1] || {};
            let queryString = '';
            if (method === 'get') queryString = options.params ? `?${qs.stringify(options.params)}` : '';
            if (['post', 'put', 'patch', 'delete'].includes(method) && !options.body) {
              if (options.useForm) options.body = qs.stringify(options.data);
              else if (options.useUpload) options.body = options.data;
              else options.body = JSON.stringify(options.data);
            }
            let timeout = options.timeout || requestTimeout;
            if (isNaN(timeout)) {
              timeout = 30000;
              console.warn('timeout should be a number type, has been changed to 30000!');
            }
            function _fetch() {
              const controller = new AbortController();
              const signal = controller.signal;

              const timeoutPromise = new Promise((resolve, reject) => {
                if (timeout === 0) {
                  resolve({});
                } else {
                  setTimeout(() => {
                    controller.abort();
                    resolve(new Response(null, { status: 408, statusText: `timeout of ${timeout}ms exceeded` }));
                  }, timeout);
                }
              });
              const requestPromise = new Promise((resolve: any, reject: any) => {
                let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
                if (!options.useForm) contentTypeHeaders = {};
                let credentials: RequestCredentials = 'same-origin';
                if (options.withCredentials || withCredentials) credentials = 'include'
                fetch(`${options.baseURL || baseURL}${url}${queryString}`, {
                  method,
                  ...options,
                  signal,
                  credentials,
                  headers: {
                    ...contentTypeHeaders,
                    ...fetchHeaders,
                    ...options.headers,
                  },
                })
                  .then(response => response.json())
                  .then((resData: any) => {
                    if ([200].includes(resData[apiDict.code])) {
                      resolve(resData);
                    } else {
                      if (!noAllowCodes.includes(resData[apiDict.code]))
                        errorMsgHandle(
                          resData[apiDict.message] || `接口错误 ${resData[apiDict.code]}`,
                          resData[apiDict.code],
                        );
                      else noAllowHandle(resData[apiDict.message] || `接口错误 ${resData[apiDict.code]}`);
                      reject(resData);
                    }
                  })
                  .catch(async (err) => {
                    reject(err);
                  });
              });

              return Promise.race([requestPromise, timeoutPromise]);
            }
            return new Promise((resolve: any, reject: any) => {
              _fetch()
                .then((resData: any) => {
                  promiseData(resData, resolve, reject);
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

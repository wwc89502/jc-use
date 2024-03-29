import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { GlobalConfig, globalConfig } from './globalConfig';
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
      get<T extends ObjectAny, K extends keyof T>(target: T, prop: K) {
        const {
          baseURL,
          fetchHeaders,
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
            let queryString: string = '';
            if (method === 'get') queryString = options.params ? `?${qs.stringify(options.params)}` : '';
            if (['post', 'put', 'patch', 'delete'].includes(method) && !options.body) {
              if (options.useForm) options.body = qs.stringify(options.data);
              else if (options.useUpload) options.body = options.data;
              else options.body = JSON.stringify(options.data);
            }
            let timeout: number = options.timeout || requestTimeout;
            if (isNaN(timeout)) {
              timeout = 30000;
              console.warn('timeout should be a number type, has been changed to 30000!');
            }

            function _fetch() {
              const controller: AbortController = new AbortController();
              const signal: AbortSignal = controller.signal;

              const timeoutPromise: Promise<void> = new Promise((resolve: (cb: any) => void): void => {
                if (timeout === 0) {
                  resolve({});
                } else {
                  setTimeout(() => {
                    controller.abort();
                    resolve(new Response(null, { status: 408, statusText: `timeout of ${timeout}ms exceeded` }));
                  }, timeout);
                }
              });
              const requestPromise: Promise<void> = new Promise(
                (resolve: (cb: any) => void, reject: (cb: any) => void): void => {
                  let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
                  if (!options.useForm) contentTypeHeaders = {};
                  let credentials: RequestCredentials = 'same-origin';
                  if (options.withCredentials || withCredentials) credentials = 'include';
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
                    .then((response: Response) => response.json())
                    .then((resData: any) => {
                      resolve(resData);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                },
              );

              return Promise.race([requestPromise, timeoutPromise]);
            }

            return new Promise((resolve: (cb: any) => void, reject: (cb: any) => void): void => {
              _fetch()
                .then((resData: any) => {
                  promiseData(resData, resolve, reject);
                })
                .catch((error) => {
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

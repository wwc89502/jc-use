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
        const { baseURL, fetchHeaders, apiDict } = globalConfig;
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
            options.timeout = options.timeout || 30000;
            function _fetch() {
              const controller = new AbortController();
              const signal = controller.signal;

              const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                  controller.abort();
                  resolve(new Response(null, { status: 408, statusText: `timeout of ${options.timeout}ms exceeded` }));
                }, options.timeout);
              });
              const requestPromise = new Promise((resolve: any, reject: any) => {
                let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
                if (!options.useForm) contentTypeHeaders = {};
                fetch(`${options.baseURL || baseURL}${url}${queryString}`, {
                  method,
                  signal,
                  ...options,
                  headers: {
                    ...contentTypeHeaders,
                    ...fetchHeaders,
                    ...options.headers,
                  },
                })
                  .then(async (res: Response) => {
                    const resData = await res.json();
                    if ([200].includes(resData[apiDict.code] || res.status)) {
                      resolve(resData);
                    } else {
                      if (!apiDict.noAllowCodes.includes(resData[apiDict.code] || res.status))
                        apiDict.errorMsgHandle(
                          resData[apiDict.message] || `接口错误 ${resData[apiDict.code] || res.status}`,
                          resData[apiDict.code] || res.status,
                        );
                      else
                        apiDict.noAllowHandle(
                          resData[apiDict.message] || `接口错误 ${resData[apiDict.code] || res.status}`,
                        );
                      reject(res);
                    }
                  })
                  .catch(async (err) => {
                    if (err.message !== 'The user aborted a request.') {
                      apiDict.errorMsgHandle(err.message, '| 出现此错误一般为接口404或Fetch方法调用有问题');
                    }
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

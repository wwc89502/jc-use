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
            function _fetch() {
              return new Promise((resolve: any, reject: any) => {
                let contentTypeHeaders: object = { 'Content-Type': 'application/x-www-form-urlencoded' };
                if (!options.useForm) contentTypeHeaders = {}
                fetch(`${baseURL}${url}${queryString}`, {
                  method,
                  ...options,
                  headers: {
                    ...contentTypeHeaders,
                    ...fetchHeaders,
                    ...options.headers,
                  },
                })
                  .then((res: Response) => {
                    if ([200].includes(res.status)) {
                      resolve(res.json());
                    } else {
                      apiDict.errorMsgHandle(`接口错误 ${res.status}`)
                      reject(res);
                    }
                  })
                  .catch((err) => {
                    apiDict.errorMsgHandle(err.message)
                    reject(err);
                  });
              });
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

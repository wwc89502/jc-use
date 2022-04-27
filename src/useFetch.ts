import objectToQueryString from './utils/objectToQueryString';
import stringToPath from './utils/stringToPath';
import promiseData from './utils/promiseData';
import { globalConfig } from './globalConfig';

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
        const { baseURL, fetchHeaders } = globalConfig;
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
            let queryString = '';
            if (method === 'get') queryString = objectToQueryString(options.params);
            if (method === 'post' && !options.body) options.body = JSON.stringify(options.data);
            function _fetch() {
              return new Promise((resolve: any, reject: any) => {
                fetch(`${baseURL}${url}${queryString}`, {
                  method,
                  ...options,
                  headers: {
                    ...fetchHeaders,
                    ...options.headers,
                  },
                })
                  .then((res: Response) => {
                    if ([200].includes(res.status)) {
                      resolve(res.json());
                    } else {
                      reject(res);
                    }
                  })
                  .catch((err) => {
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

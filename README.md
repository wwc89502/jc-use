[![CircleCI](https://circleci.com/gh/wwc89502/jc-use/tree/master.svg?style=svg)](https://circleci.com/gh/wwc89502/jc-use/tree/master) 
[![npm package](https://img.shields.io/npm/v/jc-use.svg?style=flat-square)](https://www.npmjs.com/package/jc-use) 
[![NPM downloads](http://img.shields.io/npm/dm/jc-use.svg?style=flat-square)](https://www.npmjs.com/package/jc-use) 
[![License](https://img.shields.io/npm/l/jc-use.svg)](https://www.npmjs.com/package/jc-use) 

## jc-use
> 使用 useHooks 的方式处理问题

```powershell
yarn add jc-use
```



#### globalConfig

> `globalConfig` 保存了后面 `Hooks` 使用的一些配置。

```js
// main.js
import { globalConfig } from 'jc-use'

// default config
globalConfig.setData({
  baseURL: '',
  axiosHeaders: {},
  fetchHeaders: {},
  apiDict: {
    code: 'code', // 接口返回的状态码的字段名
    successCodes: [200], // 接口请求成功的状态码集合
    noAllowCodes: [401], // 无接口请求权限的状态码集合
    data: 'data', // 接口返回数据的字段名
    message: 'msg', // 接口返回报错信息的字段名
    // 请求失败时的回调
    errorMsgHandle: (msg: string) => {
      console.error(msg)
    }
  }
})
console.log(globalConfig.baseURL)
```



#### useAxios

> 使用Axios发送http请求
>
> api.apiString([$,] config: {})

```js
const api = useAxios()

// 设置请求头
api.setAxiosHeaders({ ...headers })

// $ 替换path中的参数
// GET /users/{userId}/books =>
const userId = 1
api.getUsers$Books(userId, { params: { page: 1, size: 10 })

// _ 保持_后的大写字母不变(驼峰命名)
// GET /users/groupQuery =>
api.getUsersGroup_Query({ params: { page: 1, size: 10 })

// POST /users =>
api.postUsers({ data: { name: 'jc', age: 18 } })
```



#### useFetch

>使用Fetch发送http请求，方法同上
>
>api.apiString([$,] config: {})

```js
const api = useFetch()

// 设置请求头
api.setFetchHeaders({ ...headers })

// http请求同 useAxios
```



#### usePoll

> 轮询
>
> 相较于直接使用 `setInterval` , `usePoll` 中使用了 `debounce` 防抖，轮询http请求时，会在请求成功后延迟一定的时间进行轮询。

```js
const poll = usePoll()

// 开始轮询
let count = 0
poll.begin(async () => {
  count++
  console.log(count)
}, 3000)

// 停止轮询
poll.stop()
```

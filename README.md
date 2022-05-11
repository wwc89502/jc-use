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
  baseURL: '', // 基础路径
  axiosHeaders: {}, // useAxios 请求头
  fetchHeaders: {}, // useFetch 请求头
  withCredentials: false, // 指示是否应使用凭据进行跨站点访问控制请求
  successCodes: [200], // 接口请求成功的状态码集合
  noAllowCodes: [401], // 无接口请求权限的状态码集合
  requestTimeout: 30000, // 接口超时时间 0为不设置超时时间
  apiDict: {
    code: 'code', // 接口返回的状态码的字段名
    data: 'data', // 接口返回数据的字段名
    message: 'msg', // 接口返回报错信息的字段名
  },
  // 请求失败时的回调
  errorMsgHandle: (msg: string, status: number | string) => {
    console.error(msg, status);
  },
  // 无接口请求权限时的回调
  noAllowHandle: (msg: string) => {
    console.error(msg);
  },
})
console.log(globalConfig.baseURL)
```



#### useAxios

> 使用Axios发送http请求
>
> api.apiString([$,] config: {})

###### config 

- params GET请求参数，json格式
- data POST请求参数，json格式
- useForm 是否使用表单提交， 把`post`, `put`, `patch`, `delete`请求改为表单提交，默认为 `false`。
- useUpload 是否使用表单上传提交， 可以通过 `FormData` 对象上传文件，默认为 `false`。
- timeout 超时时间，默认为 `globalConfig` 中的 `timeout`。
- headers 请求头
- baseURL 不使用globalConfig设置的baseURL，单独指定baseURL

```js
const api = useAxios()

// 设置请求头
api.setAxiosHeaders({ ...headers })

// $ 替换path中的参数
// GET /users/{userId}/books =>
const userId = 1
api.getUsers$Books(userId, { params: { page: 1, size: 10 } })

// 使用_保持其后的大写字母或_不变，即_S代替S, __代替_
// GET /users/groupQuery =>
api.getUsersGroup_Query({ params: { page: 1, size: 10 } })

// POST /users =>
api.postUsers({ data: { name: 'jc', age: 18 } })

// POST 表单 /users =>
api.postUsers({
  data: { name: 'jc', age: 18 },
  useForm: true
})

// POST 文件上传 /users =>
const data = new FormData()
const file = HTMLInputElement.files[0]
data.append('file', file)
api.postCommonUploadAttachment({
  data,
  useUpload: true
})
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
> 相较于直接使用 `setInterval` , `usePoll` 在轮询异步任务时，会在一次完成后才会延迟一定的时间进行下一次调用。

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



#### useRAF

> 更简单的使用 `requestAnimationFrame` 来做动画
>

```js
const render = ({ stop }) => {
  // ...
  if (...) {
    // 根据条件停止动画
    stop()
  }
  // ...
}
const rAF = useRAF(render)

// 获取浏览器刷新率，返回每秒传输帧数fps、相较于60FPS的倍率stepRate
const { fps, stepRate } = await rAF.getFps()
// 开始动画，执行 `render` 函数
rAF.begin()

// 手动停止动画
rAF.stop()
```

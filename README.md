[TOC]
## jc-use
> 使用 useHooks 的方式处理问题

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
    data: 'data', // 接口返回数据的字段名
    message: 'msg', // 接口返回报错信息的字段名
    // 请求失败时的回调
    errorMsgHandle: (msg: string) => {
      console.error(msg)
    }
  }
})
```

#### useAxios
> api.apiString([$,] config: {})
```js
const api = useAxios()

// 设置请求头
api.setAxiosHeaders({ ...headers })

// $ 替换path中的参数
// GET /users/{userId}/books =>
const userId = 1
api.getUsers$Books(userId, { params: { page: 1, size: 10 })

// $$ 保持_后的大写字母不变(驼峰命名)
// GET /users/groupQuery =>
api.getUsersGroup$$Query({ params: { page: 1, size: 10 })

// POST /users =>
api.postUsers({ data: { name: 'jc', age: 18 } })
```

#### useFetch
```js
const api = useFetch()

// 设置请求头
api.setFetchHeaders({ ...headers })

// http请求同 useAxios
```

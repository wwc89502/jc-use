import axios from 'axios'

function queryToString (query) {
  let result = ''
  for (const queryElement in query) {
    result += `${queryElement}=${query[queryElement]}&`
  }
  result = result.slice(0, -1)
  return result
}

export function useFetch () {
  return new Proxy({}, {
    get (target, prop) {
      const method = /^[a-z]+/.exec(prop)[0]
      let path = '/' + prop
        .substring(method.length)
        .replace(/([a-z])([A-Z])/g, '$1/$2')
        .replace(/\$/g, '/$/')
        .toLowerCase()
      if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1)
      return (...args) => {
        const url = path.replace(/\$/g, () => args.shift())
        const options = args.shift() || {}
        let queryString = ''
        method === 'get' && (queryString = queryToString(options.params))
        method === 'post' && !options.body && (options.body = JSON.stringify(options.data))
        return new Promise((resolve, reject) => {
          fetch(`${url}?${queryString}`, {
            method,
            ...options
          })
            .then(res => {
              if ([200].includes(res.status)) {
                resolve(res.json())
              } else if ([400, 500].includes(res.status)) {
                reject(res)
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    }
  })
}

export function useAxios () {
  return new Proxy({}, {
    get (target, prop) {
      const method = /^[a-z]+/.exec(prop)[0]
      let path = '/' + prop
        .substring(method.length)
        .replace(/([a-z])([A-Z])/g, '$1/$2')
        .replace(/\$/g, '/$/')
        .toLowerCase()
      if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1)
      return (...args) => {
        const url = path.replace(/\$/g, () => args.shift())
        const options = args.shift() || {}
        return axios({
          method,
          url,
          ...options
        })
      }
    }
  })
}
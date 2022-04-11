export default function (prop) {
    const method = /^[a-z]+/.exec(prop)[0]
    let path = '/' + prop
        .substring(method.length)
        .replace(/([a-z0-9])([A-Z])/g, '$1/$2')
        .split('/')
        .map(item => {
            let newItem = item
                .toLowerCase()
                .split('$$')
                .map((item, index) => {
                    if (index === 0) {
                        return item
                    } else {
                        return item.slice(0, 1).toUpperCase() + item.slice(1)
                    }
                })
                .join('')
            return newItem
        })
        .join('/')
        .replace(/\$/g, '/$/')
    if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1)
    return {
        method,
        path
    }
}

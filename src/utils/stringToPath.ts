export default function (prop: string) {
  const execProp = /^[a-z]+/.exec(prop) || [];
  const method = execProp[0];
  let path =
    '/' +
    prop
      .substring(method.length)
      .replace(/([a-z0-9])([A-Z])/g, '$1/$2')
      .split('/')
      .map((item) => {
        const newItem = item
          .toLowerCase()
          .split('$$')
          .map((cItem, cIndex) => {
            if (cIndex === 0) {
              return cItem;
            } else {
              return cItem.slice(0, 1).toUpperCase() + cItem.slice(1);
            }
          })
          .join('');
        return newItem;
      })
      .join('/')
      .replace(/\$/g, '/$/');
  if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1);
  return {
    method,
    path,
  };
}

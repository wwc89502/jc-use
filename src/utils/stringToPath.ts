export default function (prop: string) {
  const execProp = /^[a-z]+/.exec(prop) || [];
  const method = execProp[0];
  let path =
    '/' +
    prop
      .substring(method.length)
      .replace(/_{2}/g, '~')
      .replace(/([a-z0-9~])([A-Z])/g, '$1/$2')
      .split('/')
      .map((item) => item.slice(0, 1).toLocaleLowerCase() + item.slice(1))
      .join('/')
      .replace(/_/g, '')
      .replace(/~/g, '_')
      .replace(/\$/g, '/$/');
  if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1);
  return {
    method,
    path,
  };
}

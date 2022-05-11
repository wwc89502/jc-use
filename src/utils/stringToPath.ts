interface StringToPath {
  method: string;
  path: string;
}

export default function (prop: string): StringToPath {
  const execProp: string[] = /^[a-z]+/.exec(prop) || [];
  const method: string = execProp[0];
  let path: string =
    '/' +
    prop
      .substring(method.length)
      .replace(/\$/g, '/$/')
      .replace(/_{2}/g, '~')
      .replace(/([a-z0-9~])([A-Z])/g, '$1/$2')
      .split('/')
      .map((item: string): string => item.slice(0, 1).toLocaleLowerCase() + item.slice(1))
      .join('/')
      .replace(/_/g, '')
      .replace(/~/g, '_');
  if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1);
  const stringToPath: StringToPath = {
    method,
    path,
  };
  return stringToPath;
}

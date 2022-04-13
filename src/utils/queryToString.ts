export default function (query: any) {
  let result: string = '';
  for (const queryElement in query) {
    if (query.hasOwnProperty(queryElement)) {
      result += `${queryElement}=${query[queryElement]}&`;
    }
  }
  result = result.slice(0, -1);
  return result;
}

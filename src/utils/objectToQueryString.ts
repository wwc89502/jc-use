export default function (query: object): string {
  return query
    ? Object.entries(query).reduce((queryString: string, [key ,val]: [string, string | number]): string => {
      const symbol: string = queryString.length === 0 ? '?' : '&';
      queryString += (typeof val === 'string' || typeof val === 'number') ? `${symbol}${key}=${val}` : '';
      return queryString;
    }, '')
    : '';
};

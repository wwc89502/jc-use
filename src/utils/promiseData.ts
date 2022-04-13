import { globalConfig } from '../globalConfig';

export default function (resData: any, resolve: any, reject: any) {
  const { successCodes, noAllowCodes, message, code, data, errorMsgHandle }: any = globalConfig.value.apiDict;
  if (successCodes.includes(resData[code])) {
    if (resData[data]) {
      resolve(resData[data]);
    } else {
      resolve(resData);
    }
  } else {
    const msg: string = resData[message];
    if (msg && !noAllowCodes.includes(resData[code])) errorMsgHandle(msg);
    reject(resData);
  }
}

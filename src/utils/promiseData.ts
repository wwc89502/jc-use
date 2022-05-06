import { globalConfig } from '../globalConfig';

export default function (resData: any, resolve: any, reject: any) {
  const { successCodes, noAllowCodes, message, code, data, errorMsgHandle }: any = globalConfig.apiDict;
  if (successCodes.includes(resData[code])) {
    if (resData[data]) {
      resolve(resData[data]);
    } else {
      resolve(resData);
    }
  } else {
    const msg: string = resData[message];
    const status: string = resData[code];
    if (!noAllowCodes.includes(resData[code])) errorMsgHandle(msg || `接口错误 ${status}`);
    reject(resData);
  }
}

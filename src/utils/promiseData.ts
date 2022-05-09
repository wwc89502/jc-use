import { globalConfig } from '../globalConfig';

export default function (resData: any, resolve: any, reject: any) {
  const { apiDict, errorMsgHandle, noAllowHandle, successCodes, noAllowCodes }: any = globalConfig;
  if (successCodes.includes(resData[apiDict.code])) {
    if (resData[apiDict.data]) {
      resolve(resData[apiDict.data]);
    } else {
      resolve(resData);
    }
  } else {
    const msg: string = resData[apiDict.message] || resData.statusText;
    const status: string = resData[apiDict.code];
    if (!noAllowCodes.includes(resData[apiDict.code])) errorMsgHandle(msg || `接口错误 ${status}`, status);
    else noAllowHandle(msg || `接口错误 ${status}`);
    reject(resData);
  }
}

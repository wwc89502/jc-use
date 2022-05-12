import { globalConfig, GlobalConfig } from '../globalConfig';

interface ResData {
  statusText: string;
}
export default function <T extends ResData, K extends keyof T>(
  resData: T,
  resolve: (cb: T | T[K]) => void,
  reject: (cb: T) => void,
) {
  const { apiDict, errorMsgHandle, noAllowHandle, successCodes, noAllowCodes }: GlobalConfig = globalConfig;
  const status = resData[apiDict.code as K] || '';
  if (successCodes.includes(status as string | number)) {
    if (resData[apiDict.data as K]) {
      const _resData: T[K] = resData[apiDict.data as K];
      resolve(_resData);
    } else {
      resolve(resData);
    }
  } else {
    const msg = resData[apiDict.message as K] || resData.statusText || '';
    if (!noAllowCodes.includes(status as string | number))
      errorMsgHandle((msg as string) || `接口错误 ${status}`, status as string | number);
    else noAllowHandle((msg as string) || `接口错误 ${status}`);
    reject(resData);
  }
}

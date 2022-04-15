import { debounce } from 'lodash';

/**
 * @description 轮询
 * @usage poll.begin(pollHandle, pollTime)
 * @usage poll.stop()
 */
export function usePoll() {
  let debounced: any = null;
  return {
    /**
     * @description 开始轮询
     * @param pollHandle 需要轮询的函数
     * @param pollTime 间隔时间
     */
    begin(pollHandle: any, wait: number = 1000) {
      debounced = debounce(doPoll, wait);
      async function doPoll() {
        await pollHandle?.();
        debounced();
      }
      doPoll();
    },
    /**
     * @description 停止轮询
     */
    stop() {
      debounced?.cancel();
      debounced = null;
    },
  };
}

/**
 * @description 轮询
 * @usage poll.begin(pollHandle, wait)
 * @usage poll.stop()
 */
export function usePoll() {
  let pollTimer: any = null;
  /**
   * @description 停止轮询
   */
  const stop = () => {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
  /**
   * @description 开始轮询
   * @param pollHandle 需要轮询的函数
   * @param wait 间隔时间
   */
  const begin = (pollHandle: any, wait: number = 1000) => {
    if (pollTimer) return false;
    (async function doPoll() {
      await pollHandle?.();
      pollTimer = setTimeout(doPoll, wait);
    })();
  }
  return {
    begin,
    stop
  };
}

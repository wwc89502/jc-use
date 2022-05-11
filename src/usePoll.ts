export type Callback = () => void;

export interface UsePoll {
  /**
   * @description 停止轮询
   */
  stop(): void;
  /**
   * @description 开始轮询
   * @param pollHandle {Callback} 需要轮询的函数
   * @param waitTime {number} 间隔时间
   */
  begin(pollHandle: Callback, waitTime?: number): void;
}

/**
 * @description 轮询
 * @example
 * const poll = usePoll()
 * poll.begin(pollHandle, waitTime)
 * poll.stop()
 */
export function usePoll(): UsePoll {
  let pollTimer: number | null = null;
  function stop() {
    clearTimeout(pollTimer as number);
    pollTimer = null;
  }
  function begin(pollHandle: Callback, waitTime: number = 1000) {
    if (pollTimer) return;
    (async function doPoll(): Promise<void> {
      await pollHandle?.();
      pollTimer = setTimeout(doPoll, waitTime);
    })();
  }
  const poll: UsePoll = {
    begin,
    stop,
  };
  return poll;
}

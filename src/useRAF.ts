export interface FpsOpt {
  /**
   * @description FPS 每秒传输帧数(Frames Per Second)
   */
  fps: number;
  /**
   * @description 相较于60FPS的倍率
   */
  stepRate: number;
}

export interface UseRAF {
  /**
   * @description 停止动画
   */
  stop(): void;
  /**
   * @description 开始动画
   */
  begin(): void;
  /**
   * @description 获取Fps
   */
  getFps(): Promise<FpsOpt>;
}

export type StopMethod = {
  /**
   * @description 停止动画
   */
  stop(): void;
};
export type Render = ({ stop }: StopMethod) => void;

/**
 * @description 使用 requestAnimationFrame 执行动画
 * @param render {Render} 动画渲染函数 返回 stop 方法
 * @example
 * const render = ({ stop }) => { stop() }
 * const rAF = useRAF(render)
 * rAF.begin()
 * rAF.stop()
 * await rAF.getFps()
 */
export function useRAF(render: Render): UseRAF {
  let rAFId: number | null = null;
  function stop() {
    cancelAnimationFrame(rAFId as number);
    rAFId = null;
  }
  function animLoop() {
    rAFId = requestAnimationFrame(animLoop);
    render({ stop });
  }
  function begin() {
    if (rAFId) stop();
    rAFId = requestAnimationFrame(animLoop);
  }
  function getFps(): Promise<FpsOpt> {
    let count: number = 0;
    let fpsRAFId: number = 0;
    let perDelay: number = 0;
    const fpsArr: number[] = [];
    return new Promise((resolve) => {
      (function fpsHandle(delay: number) {
        count += 1;
        fpsArr.push(1000 / (delay - perDelay));
        perDelay = delay;
        fpsRAFId = requestAnimationFrame(fpsHandle);
        if (count === 20 + 2) {
          const fps20Sum: number = fpsArr.slice(2).reduce((prev: number, curr: number): number => prev + curr);
          const fps: number = Math.round(fps20Sum / 20);
          const stepRate: number = Math.round((fps / 60) * 100) / 100;
          const fpsOpt: FpsOpt = {
            fps,
            stepRate,
          };
          resolve(fpsOpt);
          cancelAnimationFrame(fpsRAFId);
        }
      })(1);
    });
  }
  const rAF: UseRAF = {
    begin,
    stop,
    getFps,
  };
  return rAF;
}

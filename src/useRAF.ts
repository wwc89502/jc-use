/**
 * @description 使用 requestAnimationFrame 执行动画
 * @param render 动画渲染函数 返回 stop 方法
 */
export function useRAF(render: any) {
  let rAFId: any = null;
  /**
   * @description 停止动画
   */
  const stop = () => {
    cancelAnimationFrame(rAFId);
    rAFId = null;
  };
  const animLoop = () => {
    rAFId = requestAnimationFrame(animLoop);
    render({ stop });
  };
  /**
   * @description 开始动画
   */
  const begin = () => {
    if (rAFId) stop();
    rAFId = requestAnimationFrame(animLoop);
  };
  /**
   * @description 获取Fps
   */
  const getFps = () => {
    let count = 0;
    const fpsArr: number[] = [];
    let fpsRAFId = 0;
    let perDelay: any = 0;
    return new Promise((resolve) => {
      (function fpsHandle(delay: any) {
        count += 1;
        fpsArr.push(1000 / (delay - perDelay));
        perDelay = delay;
        fpsRAFId = requestAnimationFrame(fpsHandle);
        if (count === 20 + 2) {
          const fps20Sum = fpsArr.slice(2).reduce((prev, curr) => prev + curr);
          const fps = Math.round(fps20Sum / 20);
          const stepRate = 60 / fps;
          resolve({
            fps,
            stepRate,
          });
          cancelAnimationFrame(fpsRAFId);
        }
      })(1);
    });
  };
  return {
    begin,
    stop,
    getFps,
  };
}

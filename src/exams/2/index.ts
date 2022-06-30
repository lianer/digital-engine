import { isEqual } from 'lodash-es';

/**
 * 第二题
 */

// 核心用户请求
let _requestTime = 0;
const requestUserInfo = () => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 模拟 ajax 异步，1s 返回
        resolve();
      }, 1000);
    }).then(() => {
      _requestTime++;
      return {
        nick: 'nick',
        age: '18',
      };
    });
  });
};

// 方法一：在外部提前执行 requestUserInfo，把 userInfo （promise 实例）直接拿来用
// const userInfo = requestUserInfo();
// const getUserInfo = () => {
//   return userInfo;
// };

// 方法二：节流（这种比较暴力，只适用于 getUserInfo 这一种场景）
const throttle = function (callback: typeof requestUserInfo, wait: number) {
  let lastTime = Number.MIN_SAFE_INTEGER;
  let lastCache: ReturnType<typeof callback> | null = null;
  const throttled = () => {
    const curTime = Date.now();
    // 超过时间间隔 wait 则重新调用 callback（requestUserInfo），否则返回缓存值 lastCache
    if (curTime - lastTime > wait) {
      lastCache = callback();
      lastTime = curTime;
      return lastCache;
    } else {
      return lastCache;
    }
  };
  return throttled;
};

const throttledRequestUserInfo = throttle(requestUserInfo, 1000);

const getUserInfo = () => {
  return throttledRequestUserInfo();
};

// 方法三：根据入参缓存（因为 getUserInfo 没有入参，所以先不实现该方法了）

/**
 * 以下为测试用例，无需修改
 */
export default async () => {
  try {
    await Promise.all([getUserInfo(), getUserInfo()]).then((result) => {
      if (
        !isEqual(result, [
          {
            nick: 'nick',
            age: '18',
          },
          {
            nick: 'nick',
            age: '18',
          },
        ])
      ) {
        throw new Error('Wrong answer');
      }
    });
    return _requestTime === 1;
  } catch (err) {
    console.warn('测试运行失败');
    console.error(err);
    return false;
  }
};

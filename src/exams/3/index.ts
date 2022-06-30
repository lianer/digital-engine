/**
 * 第三题
 */
import { isEqual } from 'lodash-es';
import PQueue from 'p-queue';

// 核心用户请求
let _requestTime = 0;
const requestProfile = (uid: string) => {
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
        uid,
        nick: `nick-${uid}`,
        age: '18',
      };
    });
  });
};

let cnt = 0;
// 时间来不及了。。类型先不管了
const queue: any[] = [];
const cache: any = {};

/**
 *
 * @param uid uid
 * @param max 最多并发请求数量
 */
const requestUserProfile = (uid = '1', max = 2) => {
  // 这里调用 requestProfile 进行优化

  // 缓存没来得及做
  if (cache[uid]) {
    return cache[uid];
  }

  if (cnt < max) {
    cnt++;
    const p = requestProfile(uid).finally(() => {
      cnt--;
      queue.shift()?.();
    });
    cache[uid] = p;
    return p;
  } else {
    const p = new Promise((r) => {
      queue.push(r);
    }).then(() => {
      return requestProfile(uid).finally(() => {
        cnt--;
        queue.shift()?.();
      });
    });
    cache[uid] = p;
    return p;
  }
};
/**
 * 以下为测试用例，无需修改
 */
export default async () => {
  try {
    const star = Date.now();
    await Promise.all([
      requestUserProfile('1'),
      requestUserProfile('2'),
      requestUserProfile('3'),
      requestUserProfile('1'),
    ]).then((result) => {
      console.log('result', result);
      console.log('_requestTime', _requestTime);

      if (Date.now() - star < 2000 || Date.now() - star >= 3000) {
        throw new Error('Wrong answer');
      }
      if (
        !isEqual(result, [
          {
            uid: '1',
            nick: 'nick-1',
            age: '18',
          },
          {
            uid: '2',
            nick: 'nick-2',
            age: '18',
          },
          {
            uid: '3',
            nick: 'nick-3',
            age: '18',
          },
          {
            uid: '1',
            nick: 'nick-1',
            age: '18',
          },
        ])
      ) {
        throw new Error('Wrong answer');
      }
    });

    return _requestTime === 3;
  } catch (err) {
    console.warn('测试运行失败');
    console.error(err);
    return false;
  }
};

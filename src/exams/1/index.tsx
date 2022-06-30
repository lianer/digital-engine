/**
 * 第一题
 */
import React, { FC, useEffect, useState } from 'react';
import './style.less';

/**
 * 渲染测试数据
 */
export const cardDataList: IDirectVoucher[] = [
  {
    title: '杭州市通用5元券杭州市通用5元券',
    subTitle:
      '杭味面馆非常好吃，太好吃了，相当不错，味道鲜美，特别划算，快快抢购，聚划算',
  },
  {
    title: '杭州市10元券',
    subTitle: '兰州拉面非常好吃',
  },
];

/**
 * 券卡片渲染数据类型
 */
export interface IDirectVoucher {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subTitle?: string;
}

export interface ICardProps {
  data: IDirectVoucher;
}

enum Status {
  WAITING = 'waiting',
  STARTED = 'started',
  FINISHED = 'finished',
}

const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay));

const defaultCountDown = 3;

/**
 * 卡片组件
 */
const Card: FC<ICardProps> = (props) => {
  // -------- 在这里完成代码 --------
  const { data } = props;

  const [countDown, setCountDown] = useState(defaultCountDown);
  const [status, setStatus] = useState<Status>(Status.WAITING);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((count) => {
        if (count - 1 === 0) {
          clearInterval(timer);
          setStatus(Status.STARTED);
        }

        return count - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const buy = async () => {
    await sleep(200);
    setStatus(Status.FINISHED);
  };

  return (
    <div className="card">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="subTitle">{data.subTitle}</span>
      </div>
      <div className="right">
        {status === Status.WAITING && (
          <span className="action">{countDown}s</span>
        )}
        {status === Status.STARTED && (
          <span className="action" onClick={buy}>
            抢购
          </span>
        )}
        {status === Status.FINISHED && (
          <span className="action finished">已抢购</span>
        )}
      </div>
    </div>
  );
};

/**
 * 以下为测试用例，无需修改
 */
export default () =>
  cardDataList.map((data) => <Card key={data.title} data={data} />);

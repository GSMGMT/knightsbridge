import { BidAndAsk } from '@contracts/Order';

import listOrders from '@libs/firebase/functions/order/listOrders';

export interface BidAndAskListOrders {
  buy: BidAndAsk[];
  sell: BidAndAsk[];
}

export const listBidAndAskOrders: (
  martketPair?: string
) => Promise<BidAndAskListOrders> = async (martketPair) => {
  const buyProcessingPromise = listOrders({
    size: 5,
    filters: {
      status: 'PROCESSING',
      type: 'buy',
      martketPair,
    },
  });

  const sellProcessingPromise = listOrders({
    size: 5,
    filters: {
      status: 'PROCESSING',
      type: 'sell',
      martketPair,
    },
  });

  const [buyProcessing, sellProcessing] = await Promise.all([
    buyProcessingPromise,
    sellProcessingPromise,
  ]);

  const buy: BidAndAsk[] = [
    ...buyProcessing.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
  ];

  const sell: BidAndAsk[] = [
    ...sellProcessing.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
  ];

  return {
    buy,
    sell,
  };
};

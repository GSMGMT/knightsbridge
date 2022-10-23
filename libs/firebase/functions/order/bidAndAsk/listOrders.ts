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
  const buyApprovedPromise = listOrders({
    size: 2,
    filters: {
      status: 'APPROVED',
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
  const sellApprovedPromise = listOrders({
    size: 2,
    filters: {
      status: 'APPROVED',
      type: 'sell',
      martketPair,
    },
  });

  const [buyProcessing, buyApproved, sellProcessing, sellApproved] =
    await Promise.all([
      buyProcessingPromise,
      buyApprovedPromise,
      sellProcessingPromise,
      sellApprovedPromise,
    ]);

  const buy: BidAndAsk[] = [
    ...buyProcessing.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
    ...buyApproved.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
  ];

  const sell: BidAndAsk[] = [
    ...sellProcessing.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
    ...sellApproved.map(
      ({ amount, price, total, uid }) =>
        ({ amount, price, total, uid } as BidAndAsk)
    ),
  ];

  return {
    buy,
    sell,
  };
};

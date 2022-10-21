import { BidAndAsk } from '@contracts/Order';

import listOrders from '@libs/firebase/functions/order/listOrders';

export interface BidAndAskListOrders {
  buy: BidAndAsk[];
  sell: BidAndAsk[];
}

export const listBidAndAskOrders: () => Promise<BidAndAskListOrders> =
  async () => {
    const buyProcessingPromise = listOrders({
      size: 5,
      filters: {
        status: 'PROCESSING',
        type: 'buy',
      },
    });
    const buyApprovedPromise = listOrders({
      size: 2,
      filters: {
        status: 'APPROVED',
        type: 'buy',
      },
    });

    const sellProcessingPromise = listOrders({
      size: 5,
      filters: {
        status: 'PROCESSING',
        type: 'sell',
      },
    });
    const sellApprovedPromise = listOrders({
      size: 2,
      filters: {
        status: 'APPROVED',
        type: 'sell',
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

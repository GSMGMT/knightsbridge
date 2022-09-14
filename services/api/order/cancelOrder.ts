import { increment } from '@libs/firebase/admin-config';

import { OrderStatus } from '@contracts/Order';

import { getOrderByUid } from '@libs/firebase/functions/order/getOrderByUid';
import updateOrder from '@libs/firebase/functions/order/updateOrder';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

export const cancelOrder = async (orderIds: string | string[]) => {
  const orderIdsArray = Array.isArray(orderIds) ? orderIds : [orderIds];

  const orders = await Promise.all(
    orderIdsArray.map((orderId) => getOrderByUid(orderId))
  );

  const ordersNotProcessing = orders.find(
    (order) => order.status !== OrderStatus.PROCESSING
  );
  if (ordersNotProcessing) {
    throw Error('Order is not processing');
  }

  return Promise.all(
    orders.map(
      async ({
        uid: orderUid,
        type: orderType,
        marketPair,
        user: { uid: userUid },
        total,
        amount,
      }) => {
        let refoundCurrencyUid: string;
        let refoundAmount: number;

        if (orderType === 'buy') {
          refoundCurrencyUid = marketPair.quote.uid;
          refoundAmount = total;
        } else {
          refoundCurrencyUid = marketPair.base.uid;
          refoundAmount = amount;
        }

        const wallet = await getWalletByUserUid(userUid);

        if (!wallet) {
          throw Error('Wallet not found');
        }

        const asset = await getAssetByCurrencyUid(
          wallet.uid,
          refoundCurrencyUid
        );

        if (!asset) {
          throw Error('Asset not found');
        }

        return updateOrder(orderUid, {
          status: OrderStatus.CANCELED,
        }).then(() =>
          updateAsset(wallet.uid, asset.uid, {
            reserved: increment(-refoundAmount),
          })
        );
      }
    )
  );
};

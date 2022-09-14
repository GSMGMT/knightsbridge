import { increment } from '@libs/firebase/admin-config';

import { OrderStatus } from '@contracts/Order';

import { getOrderByUid } from '@libs/firebase/functions/order/getOrderByUid';
import updateOrder from '@libs/firebase/functions/order/updateOrder';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

export const rejectOrder = async (orderIds: string | string[]) => {
  const orderIdsArray = Array.isArray(orderIds) ? orderIds : [orderIds];

  const ordersUpdateStatus = orderIdsArray.map((uid) => ({
    uid,
    success: false,
  }));

  const orders = await Promise.all(
    orderIdsArray.map((orderId) => getOrderByUid(orderId))
  );

  const ordersNotProcessing = orders.find(
    (order) => order.status !== OrderStatus.PROCESSING
  );
  if (ordersNotProcessing) {
    throw Error('Order is not processing');
  }

  await Promise.all(
    orders.map(async (order) => {
      const {
        uid: orderUid,
        type: orderType,
        marketPair,
        user: { uid: userUid },
        total,
        amount,
      } = order;

      let refoundCurrencyUid: string;
      let refoundAmount: number;

      if (orderType === 'buy') {
        refoundCurrencyUid = marketPair.quote.uid;
        refoundAmount = total;
      } else {
        refoundCurrencyUid = marketPair.base.uid;
        refoundAmount = amount;
      }

      const wallet = (await getWalletByUserUid(userUid))!;

      const asset = (await getAssetByCurrencyUid(
        wallet.uid,
        refoundCurrencyUid
      ))!;

      await updateOrder(orderUid, {
        status: OrderStatus.REJECTED,
      });

      updateAsset(wallet.uid, asset.uid, {
        reserved: increment(-refoundAmount),
      });

      ordersUpdateStatus.find(({ uid }) => uid === orderUid)!.success = true;
    })
  );

  return [...ordersUpdateStatus];
};

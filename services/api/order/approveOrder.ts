import { OrderStatus } from '@contracts/Order';
import { getOrderByUid } from '@libs/firebase/functions/order/getOrderByUid';
import { approveOrderBuy } from './approve/buy';
import { approveOrderSell } from './approve/sell';

export const approveOrder = async (orderIds: string | string[]) => {
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
      const { type, uid: orderUid } = order;

      if (type === 'buy') {
        await approveOrderBuy(order);
      } else {
        await approveOrderSell(order);
      }

      ordersUpdateStatus.find(({ uid }) => uid === orderUid)!.success = true;
    })
  );

  return ordersUpdateStatus;
};

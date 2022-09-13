import { OrderStatus } from '@contracts/Order';
import updateOrder from '@libs/firebase/functions/order/updateOrder';

export const cancelOrder = async (orderIds: string | string[]) => {
  if (Array.isArray(orderIds)) {
    return Promise.all(
      orderIds.map((uid) =>
        updateOrder(uid, {
          status: OrderStatus.CANCELED,
        })
      )
    );
  }

  return updateOrder(orderIds, {
    status: OrderStatus.CANCELED,
  });
};

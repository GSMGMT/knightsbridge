import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { PresaleOrder } from '@contracts/presale/nft/PresaleOrder';
import { OmitTimestamp } from '@utils/types';

import { navigation } from '@navigation';

import { withUser } from '@middlewares/client/withUser';

import { getPresaleNFTByUid } from '@libs/firebase/functions/presale/nft/token/getPresaleNFTByUid';
import { getOrdersByNFTUid } from '@libs/firebase/functions/presale/nft/order/getOrderByNFTUid';

import { Header } from '@sections/pages/app/presale/nft/history/Item/Header';
import { Detail } from '@sections/pages/app/presale/nft/history/Item/Detail';
import { Orders } from '@components/Table/Variants/Orders';
import { Pagination } from '@components/Pagination';

import styles from '@styles/pages/app/presale/nft/history/item/Item.module.scss';

type PresaleNFTServerSide = OmitTimestamp<PresaleNFT>;
interface PresaleOrderServerSide extends OmitTimestamp<PresaleOrder> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nft: PresaleNFTServerSide;
    orders: Array<PresaleOrderServerSide>;
  }>(ctx, { freeToAccessBy: 'ADMIN' }, async () => {
    const { uid } = ctx.params as any;

    if (!uid)
      return {
        redirect: {
          destination: navigation.app.presale.nft.list,
          permanent: false,
        },
      };

    const nftPromise = getPresaleNFTByUid(uid);
    const ordersPromise = getOrdersByNFTUid(uid);

    const [nftFetched, ordersFetched] = await Promise.all([
      nftPromise,
      ordersPromise,
    ]);

    if (!nftFetched)
      return {
        redirect: {
          destination: navigation.app.presale.nft.list,
          permanent: false,
        },
      };

    const nft: PresaleNFTServerSide = {
      amount: nftFetched.amount,
      amountAvailable: nftFetched.amountAvailable,
      author: nftFetched.author,
      baseCurrency: nftFetched.baseCurrency,
      icon: nftFetched.icon,
      name: nftFetched.name,
      quote: nftFetched.quote,
      uid: nftFetched.uid,
      description: nftFetched.description,
    };

    const orders = ordersFetched
      .map(
        ({ createdAt, updatedAt, ...data }) =>
          ({
            ...data,
            createdAt: +createdAt,
            updatedAt: +updatedAt,
          } as PresaleOrderServerSide)
      )
      .sort(({ createdAt: a }, { createdAt: b }) => (a > b ? -1 : 1));

    return {
      props: { nft, orders },
    };
  });

const Page: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ nft, orders: fetchedOrders }) => {
  const orders = useMemo(
    () =>
      fetchedOrders.map(
        (order) =>
          ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          } as PresaleOrder)
      ),
    [fetchedOrders]
  );

  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = useMemo(() => 5, []);
  const totalItems = useMemo(() => orders.length, [orders]);

  const handleChangePage: (newPage: number) => void = useCallback((newPage) => {
    setPageNumber(newPage);
  }, []);

  const filteredItems = useMemo(
    () => orders.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [orders, pageSize, pageNumber]
  );

  return (
    <div className={styles.container}>
      <Header title={nft.name} />
      <Detail
        author={nft.author}
        icon={nft.icon}
        name={nft.name}
        description={nft.description}
      />
      <Orders items={filteredItems} />
      <div className={styles['pagination-area']}>
        <div className={styles['pagination-label']}>
          Showing ({filteredItems.length}) of {totalItems}
        </div>

        <Pagination
          currentPage={pageNumber}
          pageSize={pageSize}
          totalItems={totalItems}
          handleChangePage={handleChangePage}
        />
      </div>
    </div>
  );
};

export default Page;

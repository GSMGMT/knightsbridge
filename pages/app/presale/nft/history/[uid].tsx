import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { PresaleOrder } from '@contracts/presale/nft/PresaleOrder';
import { OmitTimestamp } from '@utils/types';

import { withUser } from '@middlewares/client/withUser';

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
  }>(ctx, { freeToAccessBy: 'ADMIN' }, async () => ({
    props: {
      nft: {
        amount: 0,
        amountAvailable: 0,
        author: 'Author',
        baseCurrency: {
          cmcId: 1,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'crypto',
          uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
        },
        description: 'Description',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        name: 'Name',
        quote: 20000,
        uid: 'a5a1b2e0-5b9a-11eb-ae93-0242ac130002',
      },
      orders: [
        {
          amount: 1,
          createdAt: 1611600000000,
          fee: 0,
          nft: {
            author: 'Author',
            baseCurrency: {
              cmcId: 1,
              logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
              name: 'Bitcoin',
              symbol: 'BTC',
              type: 'crypto',
              uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
            },
            description: 'Description',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
            name: 'Name',
            quote: 20000,
            uid: 'a5a1b2e0-5b9a-11eb-ae93-0242ac130002',
          },
          uid: 'e5a1b2e0-5b9a-11eb-ae93-0242ac130002',
          updatedAt: 1611600000000,
          user: {
            email: 'user@example.com',
            name: 'User',
            role: 'USER',
            surname: 'User',
            uid: '3aa1b2e0-5b9a-11eb-ae93-0242ac130002',
          },
        },
      ],
    },
  }));

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

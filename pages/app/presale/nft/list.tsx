import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { Icon } from '@components/Icon';

import { withUser } from '@middlewares/client/withUser';

import styles from '@styles/pages/app/presale/nft/list/NFTList.module.scss';

import { Collection } from '@sections/pages/app/presale/nft/list/Collection';
import { Pagination } from '@components/Pagination';

interface PresaleServerSide extends Omit<IPresale, 'createdAt' | 'updatedAt'> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nfts: PresaleServerSide[];
  }>(ctx, { freeToAccessBy: 'ADMIN' }, async () => ({
    props: {
      nfts: [
        {
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
          createdAt: 1611600000000,
          updatedAt: 1611600000000,
        },
      ],
    },
  }));

interface FormFields {
  search: string;
}

const List: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ nfts: fetchedNFTs }) => {
  const nfts = useMemo(
    () =>
      fetchedNFTs.map(
        ({ createdAt, updatedAt, ...data }) =>
          ({
            ...data,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          } as IPresale)
      ),
    [fetchedNFTs]
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const { handleSubmit: submit, control } = useForm<FormFields>({
    defaultValues: {
      search: '',
    },
  });
  const search = useMemo(() => {
    const newSearch = searchTerm.length >= 3 ? searchTerm : undefined;

    return newSearch;
  }, [searchTerm]);
  const handleSubmit = useCallback(
    submit(({ search: searchField }) => {
      setSearchTerm(searchField);
    }),
    []
  );

  const filteredItems = useMemo(
    () =>
      nfts.filter(({ name }) =>
        search ? name.toUpperCase().includes(search) : true
      ),
    [nfts, search]
  );

  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = useMemo(() => 12, []);
  const pagedItems = useMemo(
    () =>
      filteredItems.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [pageSize, pageNumber, search, filteredItems]
  );
  const totalItems = useMemo(() => filteredItems.length, [filteredItems]);

  const handleChangePage: (newPage: number) => void = useCallback((newPage) => {
    setPageNumber(newPage);
  }, []);

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.details}>
          <div className={styles.user}>Create a Digital Asset Presale</div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Controller
            name="search"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <input
                className={styles.input}
                type="text"
                placeholder="Search NFT"
                autoComplete="off"
                {...field}
                onChange={({ target: { value } }) => {
                  onChange(value.toUpperCase());
                }}
              />
            )}
          />

          <button className={styles.result} type="submit">
            <Icon name="search" size={20} />
          </button>
        </form>
      </div>
      <Collection items={pagedItems} />

      <div className={styles['pagination-area']}>
        <div className={styles['pagination-label']}>
          Showing ({pagedItems.length}) of {totalItems}
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
export default List;

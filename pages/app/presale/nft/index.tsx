import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSidePropsContext } from 'next';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { withUser } from '@middlewares/client/withUser';

import { Feature } from '@components/Feature';

import styles from '@styles/pages/app/presale/Presale.module.sass';

import { Main } from '@sections/pages/app/presale/nft/Main';
import { Buy } from '@sections/pages/app/presale/nft/Buy';
import { Trending } from '@sections/pages/app/presale/nft/Trending';

import { api } from '@services/api';
import { useInterval } from 'usehooks-ts';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' });

const PresaleNFT = () => {
  const [NFTs, setNFTs] = useState<Array<IPresale>>([]);
  const definedNFTs = useMemo(
    () => NFTs.sort(({ updatedAt: a }, { updatedAt: b }) => +b - +a),
    [NFTs]
  );
  const newestNFTs = useMemo(() => NFTs.slice(0, 3), [definedNFTs]);
  const trendingNFTs = useMemo(() => NFTs.slice(3, -1), [definedNFTs]);

  const [fetching, setFetching] = useState<boolean>(false);

  const handleFetchNFTs = useCallback(async () => {
    if (fetching) return;

    setFetching(true);

    const {
      data: { data },
    } = await api.get<{
      data: Array<IPresale>;
    }>('/api/presale/nft/token');

    const newNFTs = data.map(
      ({ createdAt, updatedAt, ...itemData }) =>
        ({
          ...itemData,
          updatedAt: new Date(updatedAt),
          createdAt: new Date(createdAt),
        } as IPresale)
    );

    setNFTs(newNFTs);
  }, [fetching]);

  useInterval(handleFetchNFTs, 1000 * 60);

  useEffect(() => {
    handleFetchNFTs();
  }, []);

  return (
    <Feature feature="presale_coins">
      <div className={styles.container}>
        <Main />
        <Buy items={newestNFTs} />
        <Trending items={trendingNFTs} />
      </div>
    </Feature>
  );
};

export default PresaleNFT;

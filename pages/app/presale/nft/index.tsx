import { FunctionComponent, useMemo } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import listNFTs from '@libs/firebase/functions/presale/nft/token/listCoins';

import { withUser } from '@middlewares/client/withUser';

import { NFTProvider } from '@store/providers/NFT';

import PresaleNFTContainer from '@sections/pages/app/presale/nft/store/Container';

import { navigation } from '@navigation';

interface PresaleServerSide extends Omit<IPresale, 'createdAt' | 'updatedAt'> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nfts: PresaleServerSide[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const allCoinsPromise = listNFTs();

    const [allNFTs] = await Promise.all([allCoinsPromise]);

    const nfts: PresaleServerSide[] = allNFTs.map(
      ({ createdAt, updatedAt, ...data }) =>
        ({
          ...data,
          createdAt: +createdAt,
          updatedAt: +updatedAt,
        } as PresaleServerSide)
    );
    if (nfts.length === 0)
      return {
        redirect: {
          destination: navigation.app.wallet,
          permanent: false,
        },
      };

    return {
      props: {
        nfts,
      },
    };
  });

const PresaleNFT: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ nfts }) => {
  const fetchedNFTs = useMemo(
    () =>
      nfts.map(
        ({ createdAt, updatedAt, ...data }) =>
          ({
            ...data,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          } as IPresale)
      ),
    [nfts]
  );

  return (
    <NFTProvider fetchedNFTs={fetchedNFTs}>
      <PresaleNFTContainer />
    </NFTProvider>
  );
};

export default PresaleNFT;

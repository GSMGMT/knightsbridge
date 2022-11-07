import { FunctionComponent, useMemo } from 'react';
import { parseCookies } from 'nookies';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { adminAuth } from '@libs/firebase/admin-config';
import listNFTs from '@libs/firebase/functions/presale/nft/token/listCoins';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { withUser } from '@middlewares/client/withUser';

import { NFTProvider } from '@store/providers/NFT';

import PresaleNFTContainer from '@sections/pages/app/presale/nft/Container';

import { navigation } from '@navigation';
import {
  Portfolio,
  PresaleData,
  usersPresalePortfolio,
} from '@services/api/presale/nft/portfolio';

interface PresaleServerSide extends Omit<IPresale, 'createdAt' | 'updatedAt'> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nfts: PresaleServerSide[];
    assets: PresaleData[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const { token } = parseCookies(ctx);
    const { uid: userUid } = await adminAuth.verifyIdToken(token);

    let assets: PresaleData[] = [];

    const wallet = await getWalletByUserUid(userUid);

    let assetsPromises: Promise<Portfolio> = Promise.resolve({ assets: [] });

    if (wallet) assetsPromises = usersPresalePortfolio(userUid);

    const allCoinsPromise = listNFTs();

    const [allNFTs, allAssets] = await Promise.all([
      allCoinsPromise,
      assetsPromises,
    ]);

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

    if (wallet)
      assets = allAssets.assets.map(
        ({ ...data }) =>
          ({
            ...data,
          } as PresaleData)
      );

    return {
      props: {
        nfts,
        assets,
      },
    };
  });

const PresaleNFT: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ nfts, assets }) => {
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

  const fetchedAssets = useMemo(() => [...assets], [assets]);

  return (
    <NFTProvider fetchedNFTs={fetchedNFTs} fetchedAssets={fetchedAssets}>
      <PresaleNFTContainer />
    </NFTProvider>
  );
};

export default PresaleNFT;

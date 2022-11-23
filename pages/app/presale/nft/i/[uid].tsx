import { FunctionComponent, useMemo } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { OmitTimestamp } from '@utils/types';

import { navigation } from '@navigation';

import { withUser } from '@middlewares/client/withUser';

import { getPresaleNFTByUid } from '@libs/firebase/functions/presale/nft/token/getPresaleNFTByUid';
import listNFTs from '@libs/firebase/functions/presale/nft/token/listCoins';

import { Container } from '@sections/pages/app/presale/nft/item/Container';

import { NFTProvider } from '@store/providers/NFT';

type PresaleNFTServerSide = OmitTimestamp<PresaleNFT> & {
  createdAt: number;
  updatedAt: number;
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nft: PresaleNFTServerSide;
    nfts: Array<PresaleNFTServerSide>;
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const { uid } = ctx.params as any;

    if (!uid)
      return {
        redirect: {
          destination: navigation.app.presale.nft.list,
          permanent: false,
        },
      };

    const nftPromise = getPresaleNFTByUid(uid);
    const nftsPromise = listNFTs({ size: 7 });

    const [nftFetched, nftsFetched] = await Promise.all([
      nftPromise,
      nftsPromise,
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
      createdAt: +nftFetched.createdAt,
      updatedAt: +nftFetched.updatedAt,
    };

    const nfts = nftsFetched.map(
      ({ createdAt, updatedAt, ...data }) =>
        ({
          ...data,
          createdAt: +createdAt,
          updatedAt: +updatedAt,
        } as PresaleNFTServerSide)
    );

    return {
      props: { nft, nfts },
    };
  });

const Page: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ nft: nftFetched, nfts: nftsFetched }) => {
  const nfts = useMemo(
    () =>
      nftsFetched.map(
        ({ createdAt, updatedAt, ...data }) =>
          ({
            ...data,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          } as PresaleNFT)
      ),
    [nftsFetched]
  );

  const nft = useMemo(
    () =>
      ({
        ...nftFetched,
        createdAt: new Date(nftFetched.createdAt),
        updatedAt: new Date(nftFetched.updatedAt),
      } as PresaleNFT),
    [nftFetched]
  );

  return (
    <NFTProvider fetchedNFTs={nfts}>
      <Container nft={nft} />
    </NFTProvider>
  );
};

export default Page;

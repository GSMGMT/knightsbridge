import { FunctionComponent, useMemo } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { OmitTimestamp } from '@utils/types';

import { withUser } from '@middlewares/client/withUser';

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
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
    props: {
      nft: {
        amount: 0,
        amountAvailable: 0,
        author: 'Author',
        createdAt: 1611600000000,
        updatedAt: 1611600000000,
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
      nfts: [],
    },
  }));

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

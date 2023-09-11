import { FunctionComponent, useMemo } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

import { withUser } from '@middlewares/client/withUser';

import { NFTProvider } from '@store/providers/NFT';

import PresaleNFTContainer from '@sections/pages/app/presale/nft/store/Container';

interface PresaleServerSide extends Omit<IPresale, 'createdAt' | 'updatedAt'> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    nfts: PresaleServerSide[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
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
